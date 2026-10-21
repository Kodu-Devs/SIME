<?php

namespace App\Http\Controllers;

use App\Models\Extintor;
use App\Models\Instalacion;
use App\Models\Piso;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

/**
 * Controlador del Módulo 2: Mapa y Dashboard.
 * Gestiona la navegación progresiva (Instalación -> Piso -> Ubicaciones) 
 * y provee métricas precalculadas para gráficas.
 */
class MapaController extends Controller
{
    /**
     * Muestra el Dashboard principal del Mapa.
     * Retorna métricas agrupadas directamente desde la base de datos 
     * descartando extintores en estatus 'Baja'.
     * 
     * Ruta: GET /mapa (Pública)
     */
    public function index()
    {
        // 1. Conteo por Estatus
        $porEstatus = Extintor::where('estatus', '!=', 'Baja')
            ->selectRaw('estatus, count(*) as total')
            ->groupBy('estatus')
            ->pluck('total', 'estatus');

        // 2. Conteo de Vencidos (calculado por fecha, no por estatus)
        $vencidos = Extintor::where('estatus', '!=', 'Baja')
            ->whereDate('fecha_vencimiento', '<', today())
            ->count();

        // 3. Conteo por Tipo de Extintor
        $porTipo = TipoExtintor::withCount([
            'extintores' => fn($q) =>
            $q->where('estatus', '!=', 'Baja')
        ])->get(['id', 'nombre']);

        // 4. Conteo por Edificio (Instalación) usando Joins para optimizar
        $porEdificio = Extintor::join('ubicaciones', 'extintores.ubicacion_id', '=', 'ubicaciones.id')
            ->join('pisos', 'ubicaciones.piso_id', '=', 'pisos.id')
            ->join('instalaciones', 'pisos.instalacion_id', '=', 'instalaciones.id')
            ->where('extintores.estatus', '!=', 'Baja')
            ->groupBy('instalaciones.nombre')
            ->selectRaw('instalaciones.nombre as nombre, count(*) as total')
            ->pluck('total', 'nombre');

        // return Inertia::render('Mapa/Index', compact(
        //     'porEstatus',
        //     'vencidos',
        //     'porTipo',
        //     'porEdificio'
        // ));
        return response()->json([
            'porEstatus' => $porEstatus,
            'vencidos' => $vencidos,
            'porTipo' => $porTipo,
            'porEdificio' => $porEdificio
        ]);
    }

    /**
     * Muestra una instalación específica y carga sus pisos.
     * 
     * Ruta: GET /mapa/{instalacion} (Pública)
     */
    public function edificio(Instalacion $instalacion)
    {
        // Cargamos los pisos de esta instalación ordenados por ID
        $instalacion->load(['pisos' => function ($query) {
            $query->orderBy('id', 'asc');
        }]);

        // return Inertia::render('Mapa/Edificio', [
        //     'instalacion' => $instalacion
        // ]);
        return $instalacion;
    }

    /**
     * Muestra las ubicaciones y los datos de los extintores de un piso específico.
     * La data extraída incluye el detalle para el "hover" en Frontend.
     * 
     * Ruta: GET /mapa/{instalacion}/{piso} (Pública)
     */
    public function piso(Instalacion $instalacion, Piso $piso)
    {
        // Validar que el piso realmente pertenezca a la instalación
        abort_if($piso->instalacion_id !== $instalacion->id, 404);

        // Cargamos ubicaciones y sus extintores (excluyendo bajas) con su tipo
        $ubicaciones = $piso->ubicaciones()->with(['extintores' => function ($query) {
            $query->where('estatus', '!=', 'Baja')->with('tipoExtintor:id,nombre');
        }])->get()->map(fn($ubicacion) => [
            'id' => $ubicacion->id,
            'nombre' => $ubicacion->nombre,
            'tipo_area' => $ubicacion->tipo_area,
            'posicion' => $ubicacion->posicion,

            // Mapeamos los extintores para mandar estrictamente lo que pide la guía (hover)
            'extintores' => $ubicacion->extintores->map(fn($ext) => [
                'id' => $ext->id,
                'etiqueta' => $ext->etiqueta_inventario,
                'tipo' => $ext->tipoExtintor?->nombre ?? 'N/A',
                'capacidad' => $ext->capacidad,
                'estatus' => $ext->estatus,
                'vencimiento' => $ext->fecha_vencimiento
            ])
        ]);

        // return Inertia::render('Mapa/Piso', [
        //     'instalacion' => $instalacion->only('id', 'nombre'),
        //     'piso' => $piso->only('id', 'nombre'),
        //     'ubicaciones' => $ubicaciones
        // ]);

        return response()->json([
            'instalacion' => $instalacion->only('id', 'nombre'),
            'piso' => $piso->only('id', 'nombre'),
            'ubicaciones' => $ubicaciones
        ]);
    }

    /**
     * Actualiza las coordenadas espaciales de una ubicación (Drag & Drop).
     * 
     * Ruta: PUT /mapa/ubicaciones/{ubicacion}/posicion (Privada - Requiere Auth)
     */
    public function updatePosicion(Request $request, Ubicacion $ubicacion)
    {
        $validated = $request->validate([
            'x' => 'required|numeric',
            'y' => 'required|numeric',
        ]);

        $ubicacion->update([
            'posicion' => [
                'x' => $validated['x'],
                'y' => $validated['y'],
            ]
        ]);

        return back()->with('success', 'Posición actualizada correctamente.');
    }
}
