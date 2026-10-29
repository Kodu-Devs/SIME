<?php

namespace Tests\Concerns;

use Illuminate\Support\Facades\DB;

trait CreaDatosDeExtintores
{
    private int $contadorEtiquetas = 0;

    protected function crearEdificio(string $nombre = 'Edificio A', string $tipo = 'Edificio'): int
    {
        return DB::table('instalaciones')->insertGetId([
            'nombre'     => $nombre,
            'tipo'       => $tipo,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    protected function crearPiso(int $instalacionId, string $nombre = 'Planta baja'): int
    {
        return DB::table('pisos')->insertGetId([
            'instalacion_id' => $instalacionId,
            'nombre'         => $nombre,
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);
    }

    protected function crearUbicacion(int $pisoId, string $nombre = 'Oficina 1', string $tipoArea = 'Oficina'): int
    {
        return DB::table('ubicaciones')->insertGetId([
            'piso_id'    => $pisoId,
            'tipo_area'  => $tipoArea,
            'nombre'     => $nombre,
            'posicion'   => json_encode(['x' => 10, 'y' => 10]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /** Crea (o reutiliza) un tipo de extintor por nombre: PQS, CO2, Agua, Clase K. */
    protected function tipo(string $nombre = 'PQS'): int
    {
        $id = DB::table('tipo_extintor')->where('nombre', $nombre)->value('id');

        if ($id) {
            return $id;
        }

        return DB::table('tipo_extintor')->insertGetId([
            'nombre'          => $nombre,
            'agente_extintor' => $nombre,
            'clase_fuego'     => 'ABC',
            'unidad'          => 'kg',
            'created_at'      => now(),
            'updated_at'      => now(),
        ]);
    }

    /** Por defecto: Disponible, tipo PQS, vence en un año. Se puede sobrescribir cualquier campo. */
    protected function crearExtintor(int $ubicacionId, array $atributos = []): int
    {
        $this->contadorEtiquetas++;

        return DB::table('extintores')->insertGetId(array_merge([
            'tipoextintor_id'     => $this->tipo('PQS'),
            'ubicacion_id'        => $ubicacionId,
            'etiqueta_inventario' => 'TEST-' . str_pad((string) $this->contadorEtiquetas, 4, '0', STR_PAD_LEFT),
            'estatus'             => 'Disponible',
            'fecha_instalacion'   => now()->subYear(),
            'fecha_vencimiento'   => now()->addYear(),
            'capacidad'           => '6 kg',
            'created_at'          => now(),
            'updated_at'          => now(),
        ], $atributos));
    }

    /** Atajo: edificio + piso + ubicación. Devuelve el id de la ubicación. */
    protected function crearUbicacionEnNuevoEdificio(string $edificio = 'Edificio A'): int
    {
        $piso = $this->crearPiso($this->crearEdificio($edificio));

        return $this->crearUbicacion($piso);
    }
}