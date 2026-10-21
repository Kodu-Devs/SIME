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
            $combos['extintores_capacitacion'] = Extintor::where('estatus', 'Medio uso')->whereDosentHave('mantenimietos', function ($q) {
                $q->where('fecha_realizada', '>=', now()->subWeek());
            })->select('id', 'etiqueta_inventario')->get();
        }

        return Inertia::render('agenda/index', ['eventos' => $eventos, 'mesActual' => $mes, 'combos' => $combos]); //diccionario clave:valor
    }




    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }



    /**
     * Store a newly created resource in storage.
     */
    public function storeMantenimiento(StoreMantenimientoRequest $request)
    {
        //Mantenimientos
        $request->validated();
        Mantenimiento::create([
            'extintor_id' => $request->input('extintor_id'),
            'tipo' => $request->input('tipo'),
            'descripcion' => $request->input('descripcion'),
            'fecha_programada' => $request->input('fecha_programada'),
            'fecha_realizada' => $request->input('fecha_realizada')
        ]);
        return back();
    }

    public function storeCapacitacion(StoreCapacitacionRequest $request)
    {
        //Capacitacion
        $request->validated();
        $capacitacion = Capacitacion::create([
            'nombre' => $request->input('nombre'),
            'fecha_hora' => $request->input('fecha_hora'),
            'ubicacion_id' => $request->input('ubicacion_id')
        ]);
        return back();
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //Este metodo no se requiere
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }


    /**
     * Nuevo metodo para realizar mantenimientos
     */
    public function realizarMantenimiento(Mantenimiento $m) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //Logica SoftDelete
    }
}
