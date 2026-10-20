<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mantenimiento;
use App\Models\Capacitacion;

class AgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
