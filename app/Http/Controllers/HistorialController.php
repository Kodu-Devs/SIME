<?php

namespace App\Http\Controllers;

use App\Models\EventoUso;
use App\Models\Mantenimiento;
use App\Models\Extintor;
use App\Services\EstatusExtintor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class HistorialController extends Controller
{
    /**
     * Muestra el historial unificado de eventos (usos y mantenimientos) con filtros.
     */
    public function index(Request $request)
    {
        // 1. Consulta de Eventos de Uso
        $usos = EventoUso::with(['extintor.ubicacion.piso.instalacion', 'user', 'capacitacion'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('extintor', function ($q) use ($search) {
                    $q->where('etiqueta_inventario', 'like', "%{$search}%");
                });
            })
            ->when($request->instalacion_id, function ($query, $instalacionId) {
                $query->whereHas('extintor.ubicacion.piso', function ($q) use ($instalacionId) {
                    $q->where('instalacion_id', $instalacionId);
                });
            })
            ->when($request->fecha_inicio, function ($query, $fechaInicio) {
                $query->whereDate('fecha', '>=', $fechaInicio);
            })
            ->when($request->fecha_fin, function ($query, $fechaFin) {
                $query->whereDate('fecha', '<=', $fechaFin);
            })
            ->get()
            ->map(function ($uso) {
                return [
                    'id' => 'uso_' . $uso->id,
                    'tipo_evento' => 'Uso',
                    'fecha' => $uso->fecha,
                    'detalle' => $uso->motivo,
                    'subtipo' => $uso->tipo_descarga, // 'total' o 'parcial'
                    'extintor' => $uso->extintor,
                    'usuario' => $uso->user ? $uso->user->name : 'Sistema',
                    'capacitacion' => $uso->capacitacion,
                ];
            });

        // 2. Consulta de Mantenimientos (Incluye eliminados lógicamente con withTrashed)
        $mantenimientos = Mantenimiento::withTrashed()
            ->with(['extintor.ubicacion.piso.instalacion'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('extintor', function ($q) use ($search) {
                    $q->where('etiqueta_inventario', 'like', "%{$search}%");
                });
            })
            ->when($request->instalacion_id, function ($query, $instalacionId) {
                $query->whereHas('extintor.ubicacion.piso', function ($q) use ($instalacionId) {
                    $q->where('instalacion_id', $instalacionId);
                });
            })
            ->when($request->fecha_inicio, function ($query, $fechaInicio) {
                $query->where(function ($q) use ($fechaInicio) {
                    $q->whereDate('fecha_realizada', '>=', $fechaInicio)
                      ->orWhere(function ($q2) use ($fechaInicio) {
                          $q2->whereNull('fecha_realizada')->whereDate('fecha_programada', '>=', $fechaInicio);
                      });
                });
            })
            ->when($request->fecha_fin, function ($query, $fechaFin) {
                $query->where(function ($q) use ($fechaFin) {
                    $q->whereDate('fecha_realizada', '<=', $fechaFin)
                      ->orWhere(function ($q2) use ($fechaFin) {
                          $q2->whereNull('fecha_realizada')->whereDate('fecha_programada', '<=', $fechaFin);
                      });
                });
            })
            ->get()
            ->map(function ($mant) {
                return [
                    'id' => 'mant_' . $mant->id,
                    'tipo_evento' => 'Mantenimiento',
                    'fecha' => $mant->fecha_realizada ?? $mant->fecha_programada,
                    'detalle' => $mant->descripcion ?? $mant->tipo,
                    'subtipo' => $mant->tipo, // 'Relleno de contenido', 'Revisión', 'Otra'
                    'extintor' => $mant->extintor,
                    'usuario' => 'Personal de Servicio',
                    'capacitacion' => null,
                ];
            });

        // 3. Combinar ambos tipos de eventos en una sola línea de tiempo ordenada
        $eventos = $usos->concat($mantenimientos)
            ->sortByDesc('fecha')
            ->values();

        return Inertia::render('Historial/Index', [
            'eventos' => $eventos,
            'filters' => $request->only(['search', 'instalacion_id', 'fecha_inicio', 'fecha_fin']),
        ]);
    }

    /**
     * Registra un nuevo uso de extintor y actualiza su estatus.
     */
    public function storeUso(Request $request)
    {
        // 1. Validaciones
        $validated = $request->validate([
            'extintor_id' => [
                'required',
                Rule::exists('extintores', 'id')->where(function ($query) {
                    $query->whereNotIn('estatus', ['Baja', 'Vacío']);
                }),
            ],
            'tipo_descarga' => ['required', Rule::in(['total', 'parcial'])],
            'fecha' => ['required', 'date', 'before_or_equal:today'],
            'motivo' => ['required', 'string', 'max:500'],
            'capacitacion_id' => ['nullable', 'exists:capacitaciones,id'],
        ]);

        // 2. Transacción de base de datos
        DB::transaction(function () use ($validated) {
            // Asignar ID del usuario autenticado
            $validated['user_id'] = Auth::id();

            // Crear el registro de uso
            EventoUso::create($validated);

            // Obtener extintor y actualizar estatus
            $extintor = Extintor::findOrFail($validated['extintor_id']);

            $servicioEstatus = 'App\Services\EstatusExtintor';

            if (class_exists($servicioEstatus)) {
                $servicioEstatus::trasUso($extintor, $validated['tipo_descarga']);
            } else {
                // Respaldo directo en lo que el Módulo 3 integra el servicio
                $nuevoEstatus = $validated['tipo_descarga'] === 'total' ? 'Vacío' : 'Medio uso';
                $extintor->update(['estatus' => $nuevoEstatus]);
            }
        });

        return redirect()->back()->with('success', 'Uso del extintor registrado correctamente.');
    }

    /**
     * Genera la descarga del informe de historial.
     */
    public function exportar(Request $request)
    {
        // Endpoint reservado para generar informes descargables
        return response()->json(['message' => 'Generando reporte...']);
    }
}