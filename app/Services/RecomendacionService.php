<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class RecomendacionService
{
    // Máximo de recomendaciones que caben en el diseño del Dashboard.
    private const LIMITE = 3;

    // Regla 4, pedida por el cliente. Se revisa el 9 de noviembre de 2026.
    private const TIPO_SUGERIDO = [
        'Cocina'      => 'Clase K',
        'Laboratorio' => 'CO2',
        'Oficina'     => 'CO2',
    ];

    private const TIPO_POR_DEFECTO = 'PQS';

    // Las áreas exteriores no requieren extintor por sí mismas:
    // solo se evalúan por sus ubicaciones (reglas 3 y 4).
    private const AREA_EXTERIOR = 'Área exterior';

    public function generar(int $limite = self::LIMITE): array
    {
        $filas = $this->conteoPorUbicacion();

        $edificios   = [];
        $pisos       = [];
        $ubicaciones = [];
        $tipos       = [];

        foreach ($filas->groupBy('edificio_id') as $filasEdificio) {
            $primera        = $filasEdificio->first();
            $nombreEdificio = $primera->edificio;
            $esExterior     = $primera->tipo_instalacion === self::AREA_EXTERIOR;

            // Regla 1: edificio completo sin extintores
            if (! $esExterior && (int) $filasEdificio->sum('total') === 0) {
                $edificios[] = [
                    'tipo'    => 'edificio',
                    'mensaje' => "{$nombreEdificio}: no tiene extintores registrados.",
                ];
                continue;
            }

            $filasPorPiso = $filasEdificio->whereNotNull('piso_id')->groupBy('piso_id');

            // Regla 2: pisos sin extintores, agrupados en un solo mensaje
            if (! $esExterior) {
                $pisosVacios = $filasPorPiso->filter(fn ($f) => (int) $f->sum('total') === 0);

                if ($pisosVacios->isNotEmpty()) {
                    $pisos[] = [
                        'tipo'    => 'piso',
                        'mensaje' => $this->mensajePisos($nombreEdificio, $pisosVacios, $filasPorPiso->count()),
                    ];
                }
            }

            foreach ($filasPorPiso as $filasPiso) {
                $nombrePiso = $filasPiso->first()->piso;

                // Si el piso ya salió como vacío, no se repiten sus ubicaciones
                if (! $esExterior && (int) $filasPiso->sum('total') === 0) {
                    continue;
                }

                foreach ($filasPiso->whereNotNull('ubicacion_id') as $fila) {
                    // Regla 3: ubicación sin extintores o sin ninguno Disponible
                    if ((int) $fila->disponibles === 0) {
                        $detalle = (int) $fila->total === 0
                            ? 'no tiene extintores registrados'
                            : 'no tiene ningún extintor disponible';

                        $ubicaciones[] = [
                            'tipo'    => 'ubicacion',
                            'mensaje' => "{$fila->ubicacion} ({$nombreEdificio}): {$detalle}.",
                        ];
                        continue;
                    }

                    // Regla 4: tiene extintores, pero ninguno del tipo sugerido
                    if ((int) $fila->total > 0 && (int) $fila->del_tipo_sugerido === 0) {
                        $sugerido = self::TIPO_SUGERIDO[$fila->tipo_area] ?? self::TIPO_POR_DEFECTO;

                        $tipos[] = [
                            'tipo'    => 'tipo_sugerido',
                            'mensaje' => "{$fila->ubicacion} ({$nombreEdificio}, {$nombrePiso}): se sugiere un extintor {$sugerido}.",
                        ];
                    }
                }
            }
        }

        // Primero una de cada tipo (por gravedad), luego se completa con el resto
        $listas = [$edificios, $pisos, $ubicaciones, $tipos];

        $primeras = collect($listas)->map(fn ($lista) => $lista[0] ?? null)->filter();
        $restantes = collect($listas)->flatMap(fn ($lista) => array_slice($lista, 1));

        return $primeras
            ->concat($restantes)
            ->take($limite)
            ->values()
            ->all();
    }

    private function mensajePisos(string $edificio, $pisosVacios, int $totalPisos): string
    {
        if ($pisosVacios->count() === $totalPisos) {
            $texto = $totalPisos === 1 ? 'en su único piso' : "en sus {$totalPisos} pisos";
        } else {
            $nombres = $pisosVacios->map(fn ($f) => $f->first()->piso)->values()->all();
            $ultimo  = array_pop($nombres);
            $texto   = 'en ' . ($nombres ? implode(', ', $nombres) . ' y ' : '') . $ultimo;
        }

        return "{$edificio}: no tiene extintores registrados {$texto}.";
    }

    /**
     * Una sola consulta: por cada ubicación, cuántos extintores tiene (sin Baja),
     * cuántos están Disponibles y cuántos son del tipo sugerido para su área.
     */
    private function conteoPorUbicacion()
    {
        $casosTipo = collect(self::TIPO_SUGERIDO)
            ->map(fn ($tipo, $area) => "when ubicaciones.tipo_area = '{$area}' then '{$tipo}'")
            ->implode(' ');

        $porDefecto = self::TIPO_POR_DEFECTO;

        return DB::table('instalaciones')
            ->leftJoin('pisos', 'pisos.instalacion_id', '=', 'instalaciones.id')
            ->leftJoin('ubicaciones', 'ubicaciones.piso_id', '=', 'pisos.id')
            ->leftJoin('extintores', function ($join) {
                $join->on('extintores.ubicacion_id', '=', 'ubicaciones.id')
                    ->where('extintores.estatus', '!=', 'Baja');
            })
            ->leftJoin('tipo_extintor', 'tipo_extintor.id', '=', 'extintores.tipoextintor_id')
            ->groupBy(
                'instalaciones.id', 'instalaciones.nombre', 'instalaciones.tipo',
                'pisos.id', 'pisos.nombre',
                'ubicaciones.id', 'ubicaciones.nombre', 'ubicaciones.tipo_area'
            )
            ->selectRaw("
                instalaciones.id as edificio_id,
                instalaciones.nombre as edificio,
                instalaciones.tipo as tipo_instalacion,
                pisos.id as piso_id,
                pisos.nombre as piso,
                ubicaciones.id as ubicacion_id,
                ubicaciones.nombre as ubicacion,
                ubicaciones.tipo_area as tipo_area,
                count(extintores.id) as total,
                sum(case when extintores.estatus = 'Disponible' then 1 else 0 end) as disponibles,
                sum(case when tipo_extintor.nombre = (case {$casosTipo} else '{$porDefecto}' end) then 1 else 0 end) as del_tipo_sugerido
            ")
            ->orderBy('instalaciones.nombre')
            ->orderBy('pisos.id')
            ->get();
    }
}