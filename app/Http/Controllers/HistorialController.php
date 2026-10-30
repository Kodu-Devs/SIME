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
        // Sin sesión no se mandan datos del historial (se verían con F12)
        if (!Auth::check()) {
            return Inertia::render('Historial/Index', [
                'eventos' => [],
                'filters' => []
            ]);
        }

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
                    'tipo_motivo' => $uso->tipo_motivo,
                    'detalle' => $uso->motivo,
                    'subtipo' => $uso->tipo_descarga,
                    'extintor' => $uso->extintor,
                    'usuario' => $uso->user ? $uso->user->name : 'Sistema',
                    'capacitacion' => $uso->capacitacion,
                ];
            });

        // 2. Consulta de Mantenimientos (Solo los realizados)
        $mantenimientos = Mantenimiento::with(['extintor.ubicacion.piso.instalacion'])
            ->whereNotNull('fecha_realizada')
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
                $query->whereDate('fecha_realizada', '>=', $fechaInicio);
            })
            ->when($request->fecha_fin, function ($query, $fechaFin) {
                $query->whereDate('fecha_realizada', '<=', $fechaFin);
            })
            ->get()
            ->map(function ($mant) {
                return [
                    'id' => 'mant_' . $mant->id,
                    'tipo_evento' => 'Mantenimiento',
                    'fecha' => $mant->fecha_realizada,
                    'tipo_motivo' => null, // Homologado para que el frontend maneje el valor vacío
                    'detalle' => $mant->descripcion ?? $mant->tipo,
                    'subtipo' => $mant->tipo,
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
        // 1. Validaciones con mensaje personalizado
        $validated = $request->validate([
            'extintor_id' => [
                'required',
                Rule::exists('extintores', 'id')->where(function ($query) {
                    $query->whereNotIn('estatus', ['Baja', 'Vacío']);
                }),
            ],
            'tipo_descarga' => ['required', Rule::in(['total', 'parcial'])],
            'fecha' => ['required', 'date', 'before_or_equal:today'],
            'tipo_motivo' => ['required', Rule::in(EventoUso::TIPOS_MOTIVO)],
            'motivo' => ['required', 'string', 'max:500'],
            'capacitacion_id' => ['nullable', 'exists:capacitaciones,id'],
        ], [
            'extintor_id.exists' => 'El extintor no existe, está vacío o fue dado de baja.',
        ]);

        // Regla: si mandan capacitacion_id, el tipo de motivo DEBE ser Capacitación
        if (!empty($validated['capacitacion_id']) && $validated['tipo_motivo'] !== 'Capacitación') {
            return back()->withErrors(['tipo_motivo' => 'El tipo de motivo debe ser "Capacitación" si se selecciona una.']);
        }

        // 2. Transacción de base de datos
        DB::transaction(function () use ($validated) {
            $validated['user_id'] = Auth::id();
            EventoUso::create($validated);

            $extintor = Extintor::findOrFail($validated['extintor_id']);
            
            // Llama directo al servicio ahora que ya existe
            EstatusExtintor::trasUso($extintor, $validated['tipo_descarga']);
        });

        return redirect()->back()->with('success', 'Uso del extintor registrado correctamente.');
    }

    // Módulo 5 · Exportar: lo programa Sara
    public function exportar(Request $request)
    {
        // TODO Sara: informe PDF / Excel
    }
}