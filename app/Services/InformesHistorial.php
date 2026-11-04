<?php

namespace App\Services;
use App\Models\Extintor;
use App\Models\EventoUso;
use App\Models\Instalacion;
use App\Models\Piso;
use Carbon\Carbon;

use Illuminate\Database\Eloquent\Collection as EloquentCollection;
/**
 * Arma los datos de los informes del Historial (los usan el PDF y el Excel).
 */
class InformesHistorial
{
    /**
     * Informe de eventos de uso.
     *
     * @param  array  $filtros  fecha_inicio, fecha_fin, instalacion_id (opcional), piso_id (opcional)
     */
        /** Edificios con sus pisos, para los combos del modal de exportar. */
    public function edificios(): EloquentCollection
    {
        return Instalacion::where('tipo', 'Edificio')
            ->with(['pisos' => fn ($q) => $q->select('id', 'instalacion_id', 'nombre')->orderBy('id')])
            ->orderBy('nombre')
            ->get(['id', 'nombre']);
    }
    public function usos(array $filtros): array
    {
        // Incluye extintores en Baja: son historia (decisión de la guía).
        $usos = EventoUso::with(['extintor.tipoExtintor', 'extintor.ubicacion.piso.instalacion'])
            ->whereDate('fecha', '>=', $filtros['fecha_inicio'])
            ->whereDate('fecha', '<=', $filtros['fecha_fin'])
            ->when($filtros['instalacion_id'] ?? null, function ($query, $instalacionId) {
                $query->whereHas('extintor.ubicacion.piso', fn ($q) => $q->where('instalacion_id', $instalacionId));
            })
            ->when($filtros['piso_id'] ?? null, function ($query, $pisoId) {
                $query->whereHas('extintor.ubicacion', fn ($q) => $q->where('piso_id', $pisoId));
            })
            ->orderBy('fecha')
            ->get();

        $filas = $usos->map(fn ($uso) => [
            'fecha' => $uso->fecha->format('d/m/Y'),
            'hora' => $uso->fecha->format('H:i'),
            'extintor' => $uso->extintor->etiqueta_inventario,
            'tipo' => $uso->extintor->tipoExtintor->nombre,
            'edificio' => $uso->extintor->ubicacion?->piso?->instalacion?->nombre,
            'ubicacion' => $uso->extintor->ubicacion?->nombre,
            'tipo_descarga' => ucfirst($uso->tipo_descarga),
            'tipo_motivo' => $uso->tipo_motivo,
            'descripcion' => $uso->motivo,
        ])->all();

                $ahora = now(); // Zona horaria pendiente de confirmar con Majo (hoy: UTC)
        return [
            'encabezado' => [
                'periodo' => Carbon::parse($filtros['fecha_inicio'])->format('d/m/Y')
                    . ' al ' . Carbon::parse($filtros['fecha_fin'])->format('d/m/Y'),
                'area' => $this->area($filtros),
                'folio' => 'INF-USO-' . $ahora->format('Ymd-Hi'),
                'generado' => $ahora->format('d/m/Y H:i'),
            ],
            'filas' => $filas,
            'resumen' => [
                'eventos' => $usos->count(),
                'total' => $usos->where('tipo_descarga', 'total')->count(),
                'parcial' => $usos->where('tipo_descarga', 'parcial')->count(),
                'extintores' => $usos->pluck('extintor_id')->unique()->count(),
            ],
        ];
    }
        /**
     * Informe de lista de extintores: inventario activo (sin Baja).
     * Las fechas del modal se ignoran; solo aplican edificio y piso.
     */
    public function extintores(array $filtros): array
    {
        $ahora = now();

        $extintores = Extintor::with(['tipoExtintor', 'ubicacion.piso.instalacion'])
            ->withMax(
                ['mantenimientos as ultimo_mantenimiento' => fn ($q) => $q->whereNotNull('fecha_realizada')],
                'fecha_realizada'
            )
            ->where('estatus', '!=', 'Baja')
            ->when($filtros['instalacion_id'] ?? null, function ($query, $instalacionId) {
                $query->whereHas('ubicacion.piso', fn ($q) => $q->where('instalacion_id', $instalacionId));
            })
            ->when($filtros['piso_id'] ?? null, function ($query, $pisoId) {
                $query->whereHas('ubicacion', fn ($q) => $q->where('piso_id', $pisoId));
            })
            ->orderBy('etiqueta_inventario')
            ->get();

        $filas = $extintores->map(fn ($e) => [
            'id' => $e->etiqueta_inventario,
            'tipo' => $e->tipoExtintor->nombre,
            'capacidad' => $e->capacidad,
            'edificio' => $e->ubicacion?->piso?->instalacion?->nombre,
            'piso' => $e->ubicacion?->piso?->nombre,
            'ubicacion' => $e->ubicacion?->nombre,
            'estatus' => $e->estatus,
            'ultimo_mantenimiento' => $e->ultimo_mantenimiento
                ? Carbon::parse($e->ultimo_mantenimiento)->format('d/m/Y')
                : 'Sin registro',
            'proxima_revision' => $e->fecha_vencimiento
                ? Carbon::parse($e->fecha_vencimiento)->format('d/m/Y')
                : '—',
        ])->all();

        $porEstatus = collect(Extintor::ESTATUS)
            ->reject(fn ($estatus) => $estatus === 'Baja')
            ->mapWithKeys(fn ($estatus) => [$estatus => $extintores->where('estatus', $estatus)->count()])
            ->all();

        $porTipo = $extintores->groupBy('tipoextintor_id')
            ->map(fn ($grupo) => [
                'tipo' => $grupo->first()->tipoExtintor->nombre,
                'clase_fuego' => $grupo->first()->tipoExtintor->clase_fuego,
                'cantidad' => $grupo->count(),
            ])
            ->sortBy('tipo')
            ->values()
            ->all();

        return [
            'encabezado' => [
                'inventario' => 'Inventario al ' . $ahora->format('d/m/Y'),
                'area' => $this->area($filtros),
                'folio' => 'INF-EXT-' . $ahora->format('Ymd-Hi'),
                'generado' => $ahora->format('d/m/Y H:i'),
            ],
            'filas' => $filas,
            'resumen' => ['total' => $extintores->count(), 'por_estatus' => $porEstatus],
            'por_tipo' => $porTipo,
        ];
    }

    /** Texto del área del encabezado: piso, edificio o todo el plantel. */
    private function area(array $filtros): string
    {
        if (! empty($filtros['piso_id'])) {
            $piso = Piso::with('instalacion')->findOrFail($filtros['piso_id']);

            return $piso->instalacion->nombre . ' · ' . $piso->nombre;
        }

        if (! empty($filtros['instalacion_id'])) {
            return Instalacion::findOrFail($filtros['instalacion_id'])->nombre;
        }

        return 'Todo el plantel';
    }
}