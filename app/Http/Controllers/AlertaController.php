<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Alerta;

class AlertaController extends Controller
{
    /**
     * Muestra la lista de alertas para el modal/panel.
     */
    public function index()
    {
        $alertas = Alerta::with(['extintor', 'mantenimieto', 'capacitacion'])
            ->noLeidas()
            ->orderBy('fecha_generada', 'desc')
            ->get()->map(function ($a) {
                //Recuperacion de datos para cada categoria y referencia
                $cat = 'Desconocida';
                $ref = 'No referencia';

                if ($a->extintor_id) {
                    $cat = 'Extintores';
                    $ref = $a->extintor->etiqueta_inventario;
                } elseif ($a->mantenimiento_id) {
                    $cat = 'Mantenimientos';
                    $ref = $a->mantenimiento->tipo . ' (' . ($a->mantenimiento->extintor->etiqueta_inventario) . ')';
                } elseif ($a->capacitacion_id) {
                    $cat = 'Capacitaciones';
                    $ref = $a->capacitaciones->nombre;
                }

                return [
                    'id' => $a->id,
                    'tipo' => $a->tipo,
                    'categoria' => $cat,
                    'mensaje' => $a->mensaje,
                    'fecha' => $a->fecha_generada,
                    'referencia' => $ref
                ];
            })->groupBy(['tipo', 'categoria']);
        //Pendiente return
    }


    /**
     * Marca una alerta específica como leída.
     */
    public function leer(Alerta $alerta) // O usar Route Model Binding: (Alerta $alerta)
    {
        DB::transaction(function () use ($alerta) {
            $alerta->update(['leida' => true]);
        });
        return back()->with('success', 'Se ha marcado como leída la alerta.');
    }


    /*
    * Marcar todas como leidas 
    */
    public function leerTodas()
    {
        DB::transaction(function () {
            Alerta::noLeidas()->update(['leida' => true]);
        });
        return back()->with('success', 'Se han marcado como leídas todas las alertas.');
    }
}
