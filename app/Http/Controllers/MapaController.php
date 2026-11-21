<?php

namespace App\Http\Controllers;

use App\Models\Instalacion;
use App\Models\Piso;
use App\Models\Ubicacion;
use App\Services\ResumenExtintores;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Extintor;

/**
 * Controlador del Módulo 2: Mapa.
 * Gestiona la navegación progresiva (Instalación -> Piso -> Ubicaciones) 
 * delegando los cálculos globales al servicio del Dashboard.
 * Centraliza la vista para renderizado dinámico de Layouts en el Frontend.
 */
class MapaController extends Controller
{
    /**
     * Muestra el primer nivel de navegación (Instalaciones) y los totales del Dashboard.
     * Utiliza subconsultas SQL (selectSub) para aislar la carga de procesamiento en el motor de Base de Datos.
     * Implementa una mutación de colección (mapWithKeys) para estructurar el DTO (Data Transfer Object)
     * exactamente con las llaves que el componente React espera, evitando lógica de mapeo en el cliente.
     * 
     * @param \App\Services\ResumenExtintores $resumen
     * @return \Inertia\Response
     */
    public function index(ResumenExtintores $resumen)
    {
        $instalaciones = Instalacion::select('instalaciones.id', 'instalaciones.nombre')
            // 1. Total de extintores operativos por instalación
            ->selectSub(function ($query) {
                $query->from('extintores')
                    ->join('ubicaciones', 'extintores.ubicacion_id', '=', 'ubicaciones.id')
                    ->join('pisos', 'ubicaciones.piso_id', '=', 'pisos.id')
                    ->whereColumn('pisos.instalacion_id', 'instalaciones.id')
                    ->where('extintores.estatus', '!=', 'Baja')
                    ->selectRaw('count(*)');
            }, 'extintores_count')

            // 2. Extintores VENCIDOS por instalación
            ->selectSub(
                Extintor::vencidos()
                    ->join('ubicaciones', 'extintores.ubicacion_id', '=', 'ubicaciones.id')
                    ->join('pisos', 'ubicaciones.piso_id', '=', 'pisos.id')
                    ->whereColumn('pisos.instalacion_id', 'instalaciones.id')
                    ->selectRaw('count(*)'),
                'vencidos_count'
            )

            // 3. Extintores POR VENCER por instalación
            ->selectSub(
                Extintor::porVencer()
                    ->join('ubicaciones', 'extintores.ubicacion_id', '=', 'ubicaciones.id')
                    ->join('pisos', 'ubicaciones.piso_id', '=', 'pisos.id')
                    ->whereColumn('pisos.instalacion_id', 'instalaciones.id')
                    ->selectRaw('count(*)'),
                'por_vencer_count'
            )
            ->get();

        // 4. Diccionario por edificio con los 3 estados reales
        $porEdificio = $instalaciones->mapWithKeys(function ($inst) {
            $total = (int) ($inst->extintores_count ?? 0);
            $vencidos = (int) ($inst->vencidos_count ?? 0);
            $porVencer = (int) ($inst->por_vencer_count ?? 0);
            $vigentes = max(0, $total - $vencidos - $porVencer);

            return [
                $inst->nombre => [
                    'total'      => $total,
                    'vigentes'   => $vigentes,
                    'por_vencer' => $porVencer,
                    'vencidos'   => $vencidos,
                ],
            ];
        });

        return Inertia::render('Mapa/Index', [
            'porEdificio'   => $porEdificio,
            'instalaciones' => $instalaciones,
            'porEstatus'    => $resumen->porEstatus(),
            'vencidos'      => $resumen->vencidos(),
            'vigentes'      => $resumen->vigentes(),
            'porVencer'     => $resumen->porVencer(),
            'total'         => $resumen->total(),
        ]);
    }

    /**
     * Muestra el segundo nivel de navegación: los pisos de una instalación específica.
     * Implementa Route Model Binding y Eager Loading para optimizar las consultas.
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
     * Muta la colección para entregar un payload estrictamente formateado para el "hover"
     * de los pines, mitigando la sobrecarga de datos en el cliente y delegando la 
     * lógica de vencimiento directamente al Modelo.
     * 
     * @param \App\Models\Instalacion $instalacion
     * @param \App\Models\Piso $piso
     * @return \Inertia\Response
     */
    public function piso(Instalacion $instalacion, Piso $piso)
    {
        // Validación de integridad relacional
        abort_if($piso->instalacion_id !== $instalacion->id, 404);

        $ubicaciones = $piso->ubicaciones()->with(['extintores' => function ($query) {
            $query->where('estatus', '!=', 'Baja')->with('tipoExtintor:id,nombre');
        }])->get()->map(fn($ubicacion) => [
            'id' => $ubicacion->id,
            'nombre' => $ubicacion->nombre,
            'tipo_area' => $ubicacion->tipo_area,
            'posicion' => $ubicacion->posicion,

            // Transformación específica para los requerimientos visuales del Frontend
            'extintores' => $ubicacion->extintores->map(fn($ext) => [
                'id' => $ext->id,
                'etiqueta' => $ext->etiqueta_inventario,
                'tipo' => $ext->tipoExtintor?->nombre ?? 'N/A',
                'capacidad' => $ext->capacidad,
                'estatus' => $ext->estatus,
                'vencimiento' => $ext->fecha_vencimiento,

                // Consumimos el método del modelo para que Frontend pinte los colores
                'estado' => $ext->estadoVencimiento(),
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
     * Muta exclusivamente la columna JSON serializada 'posicion' previniendo inyección de datos.
     * 
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Ubicacion $ubicacion
     * @return \Illuminate\Http\RedirectResponse
     */



    //modificado para que pueda actualizar la posicion de los extintores poor cada uno git

    public function updatePosicion(Request $request, Ubicacion $ubicacion)
    {
        $validated = $request->validate([
            'extintor_id' => 'required|integer',
            'x'           => 'nullable|numeric|min:0|max:100',
            'y'           => 'nullable|numeric|min:0|max:100',
        ]);
        $posiciones = is_array($ubicacion->posicion) && !isset($ubicacion->posicion['x'])
            ? $ubicacion->posicion
            : [];

        $extId = (string) $validated['extintor_id'];

        if ($validated['x'] !== null && $validated['y'] !== null) {
            $posiciones[$extId] = [
                'x' => $validated['x'],
                'y' => $validated['y'],
            ];
        } else {
            unset($posiciones[$extId]);
        }

        $ubicacion->update([
            'posicion' => empty($posiciones) ? null : $posiciones,
        ]);

        return back()->with('success', 'Posición del extintor actualizada.');
    }
}
