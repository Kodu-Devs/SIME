<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\Alerta;
use App\Models\Extintor;
use App\Models\Mantenimiento;
use App\Models\Capacitacion;
use App\Models\User;

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
            self::generar('extintor_id', $e->id, 'Urgente', 'Extintor vencido');
        } elseif ($e->estatus == 'Vacío' || $e->estatus == 'Fuera de servicio') {
            self::generar('extintor_id', $e->id, 'Urgente', 'Extintor vacío o fuera de servicio');
        } elseif ($fecha_vencimiento->betweenIncluded($fecha_hoy, $limit)) {
            self::generar('extintor_id', $e->id, 'Próximo', 'Extintor por vencer.');
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
            return;
        }

        //Validación y logica para mantenimientos
        $fecha_hoy = today();
        $fecha_programada = $m->fecha_programada;
        $limit = $fecha_hoy->copy()->addDays(7);

        if ($fecha_programada->lessThan($fecha_hoy) && $m->fecha_realizada == null) {
            self::generar('mantenimiento_id', $m->id, 'Urgente', 'Mantenimiento atrasado');
        } elseif ($fecha_programada->betweenIncluded($fecha_hoy, $limit)) {
            self::generar('mantenimiento_id', $m->id, 'Próximo', 'Mantenimiento próximo');
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
            self::generar('capacitacion_id', $c->id, 'Informativo', 'Capacitación próxima');
        }
    }


    /**
     * Método para generar una alerta
     */
    public static function generar(string $campo, int $id, string $tipo, string $mensaje)
    {
        $exists = Alerta::where($campo, $id)->where('tipo', $tipo)->noLeidas()->exists();

        if (!$exists) {
            $adminId = User::first()->id;
            DB::transaction(function () use ($campo, $id, $adminId, $tipo, $mensaje) {
                Alerta::create([
                    $campo => $id,
                    'user_id' => $adminId,
                    'tipo' => $tipo,
                    'mensaje' => $mensaje,
                    'fecha_generada' => now()->format('Y-m-d H:i:s'),
                    'leida' => false
                ]);
            });
        }
    }


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
