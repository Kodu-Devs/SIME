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
            // 1. Cuenta el total de extintores operativos por instalación saltando tablas intermedias
            ->selectSub(function ($query) {
                $query->from('extintores')
                    ->join('ubicaciones', 'extintores.ubicacion_id', '=', 'ubicaciones.id')
                    ->join('pisos', 'ubicaciones.piso_id', '=', 'pisos.id')
                    ->whereColumn('pisos.instalacion_id', 'instalaciones.id')
                    ->where('extintores.estatus', '!=', 'Baja')
                    ->selectRaw('count(*)');
            }, 'extintores_count')

            // 2. Cuenta los extintores VENCIDOS por instalación utilizando el motor de BD
            ->selectSub(function ($query) {
                $query->from('extintores')
                    ->join('ubicaciones', 'extintores.ubicacion_id', '=', 'ubicaciones.id')
                    ->join('pisos', 'ubicaciones.piso_id', '=', 'pisos.id')
                    ->whereColumn('pisos.instalacion_id', 'instalaciones.id')
                    ->where('extintores.estatus', '!=', 'Baja')
                    ->whereDate('extintores.fecha_vencimiento', '<', today())
                    ->selectRaw('count(*)');
            }, 'vencidos_count')
            ->get();

        // 3. Adaptador para Frontend: Genera el diccionario {'Edificio A': {total: 5, vencidos: 2}}
        $porEdificioUli = $instalaciones->mapWithKeys(function ($inst) {
            return [
                $inst->nombre => [
                    'total' => $inst->extintores_count ?? 0,
                    'vencidos' => $inst->vencidos_count ?? 0
                ]
            ];
        });

        // Se retorna una sola vista con las métricas consolidadas y parseadas
        return Inertia::render('Mapa/Index', [
            'porEdificio'   => $porEdificioUli,
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

        // Redirección Inertia para rehidratar el estado en segundo plano
        return back()->with('success', 'Posición actualizada correctamente.');
    }
}
