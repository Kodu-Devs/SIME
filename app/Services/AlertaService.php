<?php

namespace App\Services;

use App\Models\Alerta;
use App\Models\Extintor;
use App\Models\Mantenimiento;
use App\Models\Capacitacion;
use App\Models\User;
use PHPUnit\Logging\OpenTestReporting\Status;

class AlertaService
{
    /**
     * Método para evaluar un extintor
     */
    public static function evaluarExtintor(Extintor $e)
    {
        $fecha_vencimiento = $e->fecha_vencimiento;
        $fecha_hoy = today();
        $limit = $fecha_hoy->copy()->addDays(7);

        //Validación y logica para extintores
        if ($fecha_vencimiento->lessThan($fecha_hoy) && $e->estatus !== 'Baja') {
            //LLamar a generar con tipo:Urgente

        } elseif ($e->estatus == 'Vacío' || $e->estatus == 'Fuera de servicio') {
            //Llamar a generar con tipo:Urgente

        } elseif ($fecha_vencimiento->betweenIncluded($fecha_hoy, $limit)) {
            //Llamar a generar con tipo:Proximo
        }
    }


    /**
     * Método para evaluar un mantenimiento
     */
    public static function evaluarMantenimiento(Mantenimiento $m)
    {
        //Validar si ya tiene fecha realizada para cerrar
        if ($m->fecha_realizada !== null) {
            self::cerrarPara('mantenimiento_id', $m->id);
        }

        //Validación y logica para mantenimientos
        $fecha_hoy = today();
        $fecha_programada = $m->fecha_programada;
        $limit = $fecha_hoy->copy()->addDays(7);

        if ($fecha_programada->lessThan($fecha_hoy) && $m->fecha_realizada == null) {
            //Llamar a generar
        } elseif ($fecha_programada->betweenIncluded($fecha_hoy, $limit)) {
            //Llamar a generar
        }
    }


    /**
     * Método para evaluar una capacitacion
     */
    public static function evaluarCapacitacion(Capacitacion $c)
    {
        $fecha_hora = $c->fecha_hora;
        $fecha_hoy = today();
        $limit = $fecha_hoy->copy()->addDays(3);

        //Validación y logica para capacitaciones
        if ($fecha_hora->betweenIncluded($fecha_hoy, $limit)) {
            //Llamar a generar con tipo: Informativo
        }
    }


    /**
     * Método para generar una alerta
     */
    public static function generar($campo, $id, $tipo, $mensaje) {}


    /**
     * Método para cerrar una alerta
     */
    public static function cerrarPara(string $campo, int $valor)
    {
        Alerta::where($campo, $valor)->noLeidas()->update(['leida' => true]);
    }


    /**
     * Método para contar alertas no leidas
     */
    public static function contarNoLeidas(): int
    {
        return Alerta::noLeidas()->count();
    }
}
