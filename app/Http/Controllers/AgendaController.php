<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCapacitacionRequest;
use App\Http\Requests\StoreMantenimientoRequest;
use Illuminate\Http\Request;
use App\Models\Mantenimiento;
use App\Models\Capacitacion;
use App\Models\Extintor;
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
        //Obtener mes actual
        $mes = $request->input('mes', now()->format('Y-m'));
        $fecha_inicio = Carbon::parse($mes)->startOfMonth();
        $fecha_fin = Carbon::parse($mes)->endOfMonth();


        //Obtener mantenimientos del mes
        $mantenimientos = Mantenimiento::with('extintor')->whereBetween('fecha_programada', [$fecha_inicio, $fecha_fin])
            ->get()
            ->map(function ($dm) {
                return [
                    'id' => $dm->id,
                    'clase' => 'mantenimiento',
                    'titulo' => $dm->tipo . '-' . ($dm->extintor->etiqueta_inventario),
                    'fecha' => $dm->fecha_programada,
                    'realizado' => !is_null($dm->fecha_realizada)
                ];
            });


        //Obtener capacitaciones del mes
        $capacitacion = Capacitacion::with('ubicacion')->whereBetween('fecha_hora', [$fecha_inicio, $fecha_fin])
            ->get()
            ->map(function ($dc) {
                return [
                    'id' => $dc->id,
                    'clase' => 'capacitacion',
                    'titulo' => 'Capacitacion: ' . $dc->nombre,
                    'fecha' => $dc->fecha_hora->format('Y-m-d H:i'),
                    'realizado' => $dc->fecha_hora->isPast()
                ];
            });


        //Datos para la vista ordenados
        $eventos = $mantenimientos->concat($capacitacion)->sortBy('fecha')->values();
        $combos = [];
        //Datos para administrador
        if (Auth::check()) {
            //$combos['ubicaciones']=CatalogoUbicacion::arbol();

            //Extintores para manteninimiento
            $combos['extintores_mantenimiento'] = Extintor::where('estatus', '!=', 'Baja')->select('id', 'etiqueta_inventario', 'estatus')->get();

            //Extintores para capacitacion
            $combos['extintores_capacitacion'] = Extintor::where('estatus', 'Medio uso')->whereDoesntHave('mantenimientos', function ($q) {
                $q->where('fecha_realizada', '>=', now()->subWeek());
            })->select('id', 'etiqueta_inventario')->get();

            return Inertia::render('Agenda/Index', ['eventos' => $eventos, 'mesActual' => $mes, 'combos' => $combos]);
        }

        return Inertia::render('Publico/Agenda/Index', ['eventos' => $eventos, 'mesActual' => $mes]); //diccionario clave:valor
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
    public function updateMantenimiento(StoreMantenimientoRequest $request, Mantenimiento $m)
    {
        $v = $request->validated();
        DB::transaction(function () use ($v, $m) {
            $m->update($v);
            //AlertaService::cerrarPara('mantenimiento_id',$m->id);
        });
        return back()->with('success', 'Mantenimiento actualizado correctamente.');
    }

    //Actualizar capacitacion
    public function updateCapacitacion(StoreCapacitacionRequest $request, Capacitacion $c)
    {
        $v = $request->validated();
        DB::transaction(function () use ($v, $c) {
            $c->update($v);
            //AlertaService::cerrarPara('capacitacion_id',$c->id);
        });
        return back()->with('success', 'Capacitación actualizada correctamente.');
    }


    /**
     * Realizar el mantenimiento para registrar fecha_realizado y cambiar estado
     */
    public function realizarMantenimiento(Mantenimiento $m)
    {
        if ($m->fecha_realizada) {
            return back()->with("Aviso", "El mantenimiento ya fue realizado.");
        }

        DB::transaction(function () use ($m) {
            $m->update([
                'fecha_realizada' => now()->format('Y-m-d H:i:s')
            ]);

            //Metodos requeridos para funcionamiento
            //EstatusExtintor::trasMantenimiento($m);
            //AlertaService::cerrarPara('mantenimiento_id',$m->id);
        });
        return back()->with('success', 'Mantenimiento registrado correctamente.');
    }


    /**
     * Remove the specified resource from storage.
     */
    //Quitar mantenimientos
    public function destroyMantenimiento(Mantenimiento $m)
    {
        if ($m->fecha_realizada !== null) {
            return back()->with('error', 'No se puede eliminar un mantenimiento realizado.');
        }

        DB::transaction(function () use ($m) {
            $m->delete();
            //AlertaService::cerrarPara('mantenimiento_id',$m->id);
        });

        return back()->with('success', 'Se ha eliminado correctamente el mantenimiento.');
    }

    //Quitar capacitacion
    public function destroyCapacitacion(Capacitacion $c)
    {
        if ($c->fecha_hora->isPast() || $c->eventosUso()->exists()) {
            return back()->with('error', 'No se puede eliminar una capacitación que ya pasó o tiene usos registrados');
        }

        DB::transaction(function () use ($c) {
            $c->delete();
            //AlertaService::cerrarPara('capacitacion_id',$c->id);
        });

        return back()->with('success', 'Se ha eliminado correctamente la capacitación.');
    }
}
