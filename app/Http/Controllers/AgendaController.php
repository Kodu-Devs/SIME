<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mantenimiento;
use App\Models\Capacitacion;
use Carbon\Carbon;

class AgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Obtener mes actual
        $mes = now()->format('Y-m');
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
    public function store(Request $request)
    {
        $datos = $request->input('evento');

        //Mantenimientos
        if ($datos === 'mantenimientos') {
            $mantenimiento = Mantenimiento::create([
                //'extintor_id'
                'tipo' => $request->input('tipo'),
                'descripcion' => $request->input('descripcion'),
                'fecha_programada' => $request->input('fecha_programada'),
                'fecha_realizada' => $request->input('fecha_realizada')
            ]);
            //Guardado de alerta


            //Capacitaciones 
        } elseif ($datos === 'capacitacion') {
            $capacitacion = Capacitacion::create([
                'nombre' => $request->input('nombre'),
                'fecha_hora' => $request->input('fecha_hora'),
                //'ubicacion_id'
            ]);
            //Guardado de alerta
        }
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
