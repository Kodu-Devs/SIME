<?php

namespace App\Http\Controllers;

use App\Models\EventoUso;
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
     * Muestra el historial de eventos con filtros.
     */
    public function index(Request $request)
    {
        // Consulta de eventos de uso cargando relaciones (evita problema N+1)
        $eventos = EventoUso::with(['extintor.ubicacion.piso.instalacion', 'user', 'capacitacion'])
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
            ->latest('fecha')
            ->get();

        $datos = [
            'eventos' => $eventos,
            'filters' => $request->only(['search', 'instalacion_id']),
        ];

        // Mapeo a vistas según la sesión del usuario (Admin vs Público)
        if (Auth::check()) {
            return Inertia::render('Historial/Index', $datos);
        }

        return Inertia::render('Publico/Historial', $datos);
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
