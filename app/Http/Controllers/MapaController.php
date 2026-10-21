<?php

namespace App\Http\Controllers;

use App\Models\Piso;
use App\Models\Ubicacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controlador encargado de gestionar la información espacial y de estado
 * para el Mapa Interactivo del panel de administradores (SPA - Inertia.js).
 */
class MapaController extends Controller
{
    /**
     * Obtiene la estructura de pisos, ubicaciones y el estatus actual de sus extintores.
     * Implementa Eager Loading para mitigar el problema N+1 y muta la colección para 
     * entregar un payload JSON estrictamente formateado, reduciendo la carga de 
     * procesamiento lógico en el frontend.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $pisos = Piso::with(['ubicaciones.extintores'])->get()
            ->map(fn($piso) => [
                'id' => $piso->id,
                'nombre' => $piso->nombre,

                // Transformación de la colección de ubicaciones para aislar la data de presentación
                'ubicaciones' => $piso->ubicaciones->map(fn($ubicacion) => [
                    'id' => $ubicacion->id,
                    'nombre' => $ubicacion->nombre ?? 'Sin nombre',
                    'tipo_area' => $ubicacion->tipo_area ?? 'No definido',
                    'posicion' => $ubicacion->posicion ?? null,

                    // Se resuelve el primer registro de la relación hasMany (Extintores)
                    // para asignar la directiva visual (color del pin) en el mapa del cliente.
                    'estatus_extintor' => $ubicacion->extintores->first()?->estatus ?? 'sin_extintor',
                    'etiqueta_extintor' => $ubicacion->extintores->first()?->etiqueta_inventario ?? 'N/A'
                ])
            ]);

        // Inyección del payload directamente al componente de React
        return Inertia::render('Admin/Mapa/Index', [
            'pisos' => $pisos
        ]);
    }

    /**
     * Actualiza las coordenadas (X, Y) de una ubicación específica.
     * Diseñado para ser consumido mediante acciones de Drag and Drop.
     * Utiliza Route Model Binding para la inyección automática del modelo.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Ubicacion  $ubicacion
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updatePosicion(Request $request, Ubicacion $ubicacion)
    {
        // Validación estricta del payload para garantizar la integridad de las coordenadas espaciales
        $validated = $request->validate([
            'x' => 'required|numeric',
            'y' => 'required|numeric',
        ]);

        // Mutación del campo JSON. La serialización es manejada nativamente
        // por el atributo $casts definido en el modelo Ubicacion.
        $ubicacion->update([
            'posicion' => [
                'x' => $validated['x'],
                'y' => $validated['y'],
            ]
        ]);

        // Redirección Inertia: Notifica éxito y fuerza la rehidratación del estado (props) 
        // en el frontend sin recargar el DOM completo.
        return back()->with('success', 'Posición guardada correctamente en el mapa.');
    }
}
