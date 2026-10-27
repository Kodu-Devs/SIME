<?php

namespace App\Http\Controllers;

use App\Models\Instalacion;
use App\Models\Piso;
use App\Models\Ubicacion;
use App\Services\ResumenExtintores;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controlador del Módulo 2: Mapa.
 * Gestiona la navegación progresiva (Instalación -> Piso -> Ubicaciones) 
 * delegando los cálculos globales al servicio del Dashboard.
 */
class MapaController extends Controller
{
    /**
     * Muestra el primer nivel de navegación (Instalaciones) y los totales del Dashboard.
     * Utiliza selectSub para contar extintores a través de relaciones profundas.
     * 
     * @param \App\Services\ResumenExtintores $resumen
     * @return \Inertia\Response
     */
    public function index(ResumenExtintores $resumen)
    {
        // Conteo optimizado con subconsulta para saltar Pisos y Ubicaciones
        $instalaciones = Instalacion::select('instalaciones.*')
            ->selectSub(function ($query) {
                $query->from('extintores')
                    ->join('ubicaciones', 'extintores.ubicacion_id', '=', 'ubicaciones.id')
                    ->join('pisos', 'ubicaciones.piso_id', '=', 'pisos.id')
                    ->whereColumn('pisos.instalacion_id', 'instalaciones.id')
                    ->where('extintores.estatus', '!=', 'Baja')
                    ->selectRaw('count(*)');
            }, 'extintores_count')
            ->get();

        return Inertia::render('Mapa/Index', [
            'instalaciones' => $instalaciones,
            'porEstatus' => $resumen->porEstatus(),
            'vencidos' => $resumen->vencidos()
        ]);
    }

    /**
     * Muestra el segundo nivel de navegación: los pisos de una instalación específica.
     * 
     * @param \App\Models\Instalacion $instalacion
     * @return \Inertia\Response
     */
    public function edificio(Instalacion $instalacion)
    {
        $instalacion->load(['pisos' => function ($query) {
            $query->orderBy('id', 'asc');
        }]);

        return Inertia::render('Mapa/Edificio', [
            'instalacion' => $instalacion
        ]);
    }

    /**
     * Muestra el tercer nivel de navegación: las ubicaciones y sus extintores.
     * 
     * @param \App\Models\Instalacion $instalacion
     * @param \App\Models\Piso $piso
     * @return \Inertia\Response
     */
    public function piso(Instalacion $instalacion, Piso $piso)
    {
        abort_if($piso->instalacion_id !== $instalacion->id, 404);

        $ubicaciones = $piso->ubicaciones()->with(['extintores' => function ($query) {
            $query->where('estatus', '!=', 'Baja')->with('tipoExtintor:id,nombre');
        }])->get()->map(fn($ubicacion) => [
            'id' => $ubicacion->id,
            'nombre' => $ubicacion->nombre,
            'tipo_area' => $ubicacion->tipo_area,
            'posicion' => $ubicacion->posicion,

            'extintores' => $ubicacion->extintores->map(fn($ext) => [
                'id' => $ext->id,
                'etiqueta' => $ext->etiqueta_inventario,
                'tipo' => $ext->tipoExtintor?->nombre ?? 'N/A',
                'capacidad' => $ext->capacidad,
                'estatus' => $ext->estatus,
                'vencimiento' => $ext->fecha_vencimiento
            ])
        ]);

        return Inertia::render('Mapa/Piso', [
            'instalacion' => $instalacion->only('id', 'nombre'),
            'piso' => $piso->only('id', 'nombre'),
            'ubicaciones' => $ubicaciones
        ]);
    }

    /**
     * Endpoint protegido para actualizar coordenadas (X, Y) vía Drag and Drop.
     * 
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Ubicacion $ubicacion
     * @return \Illuminate\Http\RedirectResponse
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
