<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCapacitacionRequest;
use App\Http\Requests\StoreMantenimientoRequest;
use Illuminate\Http\Request;
use App\Models\Mantenimiento;
use App\Models\Capacitacion;
use App\Models\Extintor;
use App\Services\CatalogoUbicaciones;
use App\Services\AlertaService;
use App\Services\EstatusExtintor;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //Validar mes
        $request->validate(['mes' => ['nullable', 'date_format:Y-m']]);

        //Obtener mes actual
        $mes = $request->input('mes', now()->format('Y-m'));
        $fecha_inicio = Carbon::parse($mes)->startOfMonth();
        $fecha_fin = Carbon::parse($mes)->endOfMonth();


        //Obtener mantenimientos del mes
        $mantenimientos = collect(); //Coleccion vacia para publico

        if (Auth::check()) {
            $mantenimientos = Mantenimiento::with('extintor')->whereBetween('fecha_programada', [$fecha_inicio, $fecha_fin])
                ->get()
                ->map(function ($dm) {
                    return [
                        'id' => $dm->id,
                        'clase' => 'mantenimiento',
                        'titulo' => $dm->tipo . '-' . ($dm->extintor->etiqueta_inventario),
                        'descripcion' => $dm->descripcion, //Campo a petición de observaciones
                        'fecha' => $dm->fecha_programada->format('Y-m-d H:i:s'),
                        'realizado' => !is_null($dm->fecha_realizada)
                    ];
                });
        }


        //Obtener capacitaciones del mes
        $capacitaciones = Capacitacion::with(['ubicacion', 'eventosUso:id,capacitacion_id,extintor_id'])->whereBetween('fecha_hora', [$fecha_inicio, $fecha_fin])
            ->get()
            ->map(function ($dc) {
                $extintores_id = $dc->eventosUso->pluck('extintor_id')->unique()->values();
                return [
                    'id' => $dc->id,
                    'clase' => 'capacitacion',
                    'titulo' => 'Capacitacion: ' . $dc->nombre,
                    'ubicacion_id' => $dc->ubicacion_id, //Requerido para el combo de ubicaciones
                    'extintores_id' => $extintores_id->isEmpty() ? 'Sin extintores' : $extintores_id, //Si no se encuentran, regresa "Sin extintores"
                    'fecha' => $dc->fecha_hora->format('Y-m-d H:i:s'),
                    'realizado' => $dc->fecha_hora->isPast()
                ];
            });


        //Datos para la vista ordenados
        $eventos = $mantenimientos->concat($capacitaciones)->sortBy('fecha')->values();
        $combos = [];
        //Datos para administrador
        if (Auth::check()) {
            //Obtiene ubicaciones
            $combos['ubicaciones'] = CatalogoUbicaciones::arbol();

            //Extintores para manteninimiento
            $combos['extintores_mantenimiento'] = Extintor::with(['tipoExtintor', 'ubicacion.piso.instalacion'])->where('estatus', '!=', 'Baja')->get()
                ->map(function ($e) {
                    return [
                        'id' => $e->id,
                        'etiqueta_inventario' => $e->etiqueta_inventario,
                        'estatus' => $e->estatus,
                        'tipoextintor_nombre' => $e->tipoExtintor->nombre,
                        'ubicacion_nombre' => $e->ubicacion->nombre,
                        'piso_numero' => $e->ubicacion->piso->id,
                        'piso_nombre' => $e->ubicacion->piso->nombre,
                        'edificio' => $e->ubicacion->piso->instalacion->nombre
                    ];
                });

            //Extintores para capacitacion
            $combos['extintores_capacitacion'] = Extintor::where('estatus', 'Medio uso')->whereDoesntHave('mantenimientos', function ($q) {
                $q->where('fecha_realizada', '>=', now()->subWeek());
            })->select('id', 'etiqueta_inventario')->get();
        }

        return Inertia::render('Agenda/Index', ['eventos' => $eventos, 'mesActual' => $mes, 'combos' => $combos]);
    }


    /**
     * Store a newly created resource in storage.
     */
    //Mantenimientos
    public function storeMantenimiento(StoreMantenimientoRequest $request)
    {
        $v = $request->validated();
        DB::transaction(function () use ($v) {
            Mantenimiento::create([
                'extintor_id' => $v['extintor_id'],
                'tipo' => $v['tipo'],
                'descripcion' => $v['descripcion'],
                'fecha_programada' => $v['fecha_programada'],
                'fecha_realizada' => null
            ]);
        });
        return back()->with('success', 'Mantenimiento creado correctamente.');
    }

    //Capacitaciones
    public function storeCapacitacion(StoreCapacitacionRequest $request)
    {
        $v = $request->validated();
        DB::transaction(function () use ($v) {
            Capacitacion::create([
                'nombre' => $v['nombre'],
                'fecha_hora' => $v['fecha_hora'],
                'ubicacion_id' => $v['ubicacion_id']
            ]);
        });
        return back()->with('success', 'Capacitación creada correctamente.');
    }


    /**
     * Update the specified resource in storage.
     */
    //Actualizar mantenimiento
    public function updateMantenimiento(StoreMantenimientoRequest $request, Mantenimiento $mantenimiento)
    {
        if ($mantenimiento->fecha_realizada !== null) {
            return back()->with('error', 'No se puede editar un mantenimiento realizado.');
        }

        $v = $request->validated();

        DB::transaction(function () use ($v, $mantenimiento) {
            $mantenimiento->update($v);
            AlertaService::cerrarPara('mantenimiento_id', $mantenimiento->id);
        });
        return back()->with('success', 'Mantenimiento actualizado correctamente.');
    }

    //Actualizar capacitacion
    public function updateCapacitacion(StoreCapacitacionRequest $request, Capacitacion $capacitacion)
    {
        if ($capacitacion->fecha_hora->isPast() || $capacitacion->eventosUso()->exists()) {
            return back()->with('error', 'No se puede editar una capacitación que ya pasó o tiene usos registrados');
        }

        $v = $request->validated();

        DB::transaction(function () use ($v, $capacitacion) {
            $capacitacion->update($v);
            AlertaService::cerrarPara('capacitacion_id', $capacitacion->id);
        });
        return back()->with('success', 'Capacitación actualizada correctamente.');
    }


    /**
     * Realizar el mantenimiento para registrar fecha_realizado y cambiar estado
     */
    public function realizarMantenimiento(Mantenimiento $mantenimiento)
    {
        if ($mantenimiento->fecha_realizada) {
            return back()->with("error", "El mantenimiento ya fue realizado.");
        }

        DB::transaction(function () use ($mantenimiento) {
            $mantenimiento->update([
                'fecha_realizada' => now()->format('Y-m-d H:i:s')
            ]);
            EstatusExtintor::trasMantenimiento($mantenimiento);
            AlertaService::cerrarPara('mantenimiento_id', $mantenimiento->id);
        });
        return back()->with('success', 'Mantenimiento registrado correctamente.');
    }


    /**
     * Remove the specified resource from storage.
     */
    //Quitar mantenimientos
    public function destroyMantenimiento(Mantenimiento $mantenimiento)
    {
        if ($mantenimiento->fecha_realizada !== null) {
            return back()->with('error', 'No se puede eliminar un mantenimiento realizado.');
        }

        DB::transaction(function () use ($mantenimiento) {
            $mantenimiento->delete();
            AlertaService::cerrarPara('mantenimiento_id', $mantenimiento->id);
        });

        return back()->with('success', 'Se ha eliminado correctamente el mantenimiento.');
    }


    //Quitar capacitacion
    public function destroyCapacitacion(Capacitacion $capacitacion)
    {
        if ($capacitacion->fecha_hora->isPast() || $capacitacion->eventosUso()->exists()) {
            return back()->with('error', 'No se puede eliminar una capacitación que ya pasó o tiene usos registrados');
        }

        DB::transaction(function () use ($capacitacion) {
            $capacitacion->delete();
            AlertaService::cerrarPara('capacitacion_id', $capacitacion->id);
        });

        return back()->with('success', 'Se ha eliminado correctamente la capacitación.');
    }
}
