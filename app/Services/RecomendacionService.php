<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class RecomendacionService
{
    private const TIPO_SUGERIDO = [
        'Cocina'      => 'Clase K',
        'Laboratorio' => 'CO2',
        'Oficina'     => 'CO2',
    ];

    private const TIPO_POR_DEFECTO = 'PQS';
    public function generar(int $limite = 5): array
    {
        $filas = $this->conteoPorUbicacion();

        $edificios   = [];
        $pisos       = [];
        $ubicaciones = [];
        $tipos       = [];

        foreach ($filas->groupBy('edificio_id') as $filasEdificio) {
            $nombreEdificio = $filasEdificio->first()->edificio;

            // Regla 1: edificio completo sin extintores
            if ((int) $filasEdificio->sum('total') === 0) {
                $edificios[] = [
                    'tipo'    => 'edificio',
                    'mensaje' => "{$nombreEdificio}: no tiene extintores registrados.",
                ];
                continue;
            }

            $filasConPiso = $filasEdificio->whereNotNull('piso_id');

            foreach ($filasConPiso->groupBy('piso_id') as $filasPiso) {
                $nombrePiso = $filasPiso->first()->piso;

                // Regla 2: piso sin extintores
                if ((int) $filasPiso->sum('total') === 0) {
                    $pisos[] = [
                        'tipo'    => 'piso',
                        'mensaje' => "{$nombreEdificio}: no tiene extintores registrados en {$nombrePiso}.",
                    ];
                    continue;
                }

                // Regla 3: ubicaciones sin ningún extintor Disponible
                foreach ($filasPiso->whereNotNull('ubicacion_id') as $fila) {
                                        if ((int) $fila->disponibles === 0) {
                        $detalle = (int) $fila->total === 0
                            ? 'no tiene extintores registrados'
                            : 'no tiene ningún extintor disponible';

                        $ubicaciones[] = [
                            'tipo'    => 'ubicacion',
                            'mensaje' => "{$fila->ubicacion} ({$nombreEdificio}, {$nombrePiso}): {$detalle}.",
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

        return collect($edificios)
            ->concat($pisos)
            ->concat($ubicaciones)
            ->concat($tipos)
            ->take($limite)
            ->values()
            ->all();
    }

    /**
     * Una sola consulta: por cada ubicación de cada edificio, cuántos extintores tiene (sin contar Baja) y cuántos estsn disponibles.
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
            ->where('instalaciones.tipo', 'Edificio')
            ->groupBy(
                'instalaciones.id', 'instalaciones.nombre',
                'pisos.id', 'pisos.nombre',
                'ubicaciones.id', 'ubicaciones.nombre', 'ubicaciones.tipo_area'
            )
            ->selectRaw("
                instalaciones.id as edificio_id,
                instalaciones.nombre as edificio,
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