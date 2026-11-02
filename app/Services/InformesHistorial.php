<?php

namespace App\Services;

use App\Models\EventoUso;
use App\Models\Instalacion;
use App\Models\Piso;
use Carbon\Carbon;

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

        return [
            'encabezado' => [
                'periodo' => Carbon::parse($filtros['fecha_inicio'])->format('d/m/Y')
                    . ' al ' . Carbon::parse($filtros['fecha_fin'])->format('d/m/Y'),
                'area' => $this->area($filtros),
                'folio' => 'INF-USO-' . now()->format('Ymd-Hi'),
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