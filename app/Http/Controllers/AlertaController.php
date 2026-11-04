<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Alerta;

class AlertaController extends Controller
{
    /**
     * Muestra la lista de alertas para el modal/panel.
     */
    public function index()
    {
        $alertas = Alerta::with([
            'extintor.ubicacion.piso.instalacion',
            'mantenimiento.extintor.ubicacion.piso.instalacion',
            'capacitacion.ubicacion.piso.instalacion'
        ])->noLeidas()->orderBy('fecha_generada', 'desc')->get()
            ->map(function ($a) {
                $ubicacion = 'Desconocido';
                $piso = 'Desconocido';
                $instalacion = 'Desconocida';
                $ref = 'n/a';

                if ($a->extintor_id) {
                    $ubicacion = $a->extintor->ubicacion->nombre;
                    $piso = $a->extintor->ubicacion->piso->nombre;
                    $instalacion = $a->extintor->ubicacion->piso->instalacion->nombre;
                    $ref = 'Extintor' . ' ' . $a->extintor->etiqueta_inventario;
                } elseif ($a->mantenimiento_id) {
                    $ubicacion = $a->mantenimiento->extintor->ubicacion->nombre;
                    $piso = $a->mantenimiento->extintor->ubicacion->piso->nombre;
                    $instalacion = $a->mantenimiento->extintor->ubicacion->piso->instalacion->nombre;
                    $ref = 'Mantenimiento' . ' ' . $a->mantenimiento->tipo . ' (' . $a->mantenimiento->extintor->etiqueta_inventario . ')';
                } elseif ($a->capacitacion_id) {
                    $ubicacion = $a->capacitacion->ubicacion->nombre;
                    $piso = $a->capacitacion->ubicacion->piso->nombre;
                    $instalacion = $a->capacitacion->ubicacion->piso->instalacion->nombre;
                    $ref = 'Capacitacion' . ' ' . $a->capacitacion->nombre;
                }

                $datos_ubicacion = $ubicacion . ' ' . $instalacion . ' ' . $piso;

                return [
                    'id' => $a->id,
                    'tipo' => $a->tipo,
                    'categoria' => $a->categoria,
                    'mensaje' => $a->mensaje,
                    'ubicacion' => $datos_ubicacion,
                    'referencia' => $ref,
                    'fecha_generada' => $a->fecha_generada->format('Y-m-d H:i:s')
                ];
            })->groupBy(['tipo', 'categoria']);

        return Inertia::render('Alertas/Index', ['alertas' => $alertas]);
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
