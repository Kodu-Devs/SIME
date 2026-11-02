<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\Alerta;
use App\Models\Extintor;
use App\Models\Mantenimiento;
use App\Models\Capacitacion;
use App\Models\User;
use Carbon\Carbon;

class AlertaService
{
    /**
     * Método para evaluar un extintor
     */
    public static function evaluarExtintor(Extintor $e)
    {
        //Validar que el extintor no este en baja
        if ($e->estatus == 'Baja') {
            return;
        }

        $estado = $e->estadoVencimiento(); //Valida el estado del extintor

        //Validación y logica para extintores
        if ($estado == 'vencido') {
            self::generar('extintor_id', $e->id, 'Urgente', 'vencido', 'Extintor vencido');
        } elseif ($e->estatus == 'Vacío' || $e->estatus == 'Fuera de servicio') {
            self::generar('extintor_id', $e->id, 'Urgente', 'estatus', 'Extintor vacío o fuera de servicio');
        } elseif ($estado == 'por_vencer') {
            self::generar('extintor_id', $e->id, 'Próximo', 'por_vencer', 'Extintor por vencer');
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
        $fecha_programada = Carbon::parse($m->fecha_programada);
        $limit = $fecha_hoy->copy()->addDays(config('sime.dias_por_vencer'));

        if ($fecha_programada->lessThan($fecha_hoy) && $m->fecha_realizada == null) {
            self::generar('mantenimiento_id', $m->id, 'Urgente', 'mantenimiento', 'Mantenimiento atrasado');
        } elseif ($fecha_programada->betweenIncluded($fecha_hoy, $limit)) {
            self::generar('mantenimiento_id', $m->id, 'Próximo', 'mantenimiento', 'Mantenimiento próximo');
        }
    }


    /**
     * Método para evaluar una capacitacion
     */
    public static function evaluarCapacitacion(Capacitacion $c)
    {
        $fecha_hora = Carbon::parse($c->fecha_hora);
        $fecha_hoy = today();
        $limit = $fecha_hoy->copy()->addDays(3);

        //Validación y logica para capacitaciones
        if ($fecha_hora->betweenIncluded($fecha_hoy, $limit)) {
            self::generar('capacitacion_id', $c->id, 'Informativo', 'capacitacion', 'Capacitación próxima');
        }
    }


    /**
     * Método para generar una alerta
     */
    public static function generar(string $campo, int $id, string $tipo, string $categoria, string $mensaje)
    {
        //Filtro para duplicidad de $campo + misma categoria
        $exists = Alerta::where($campo, $id)->where('categoria', $categoria)->noLeidas()->exists();

        if (!$exists) {
            $adminId = User::first()->id;
            DB::transaction(function () use ($campo, $id, $adminId, $tipo, $categoria, $mensaje) {
                Alerta::create([
                    $campo => $id,
                    'user_id' => $adminId,
                    'tipo' => $tipo,
                    'categoria' => $categoria,
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
    public static function cerrarPara(string $campo, int $valor, string $categoria = null)
    {
        Alerta::where($campo, $valor)->where('categoria', $categoria)->noLeidas()->update(['leida' => true]);
    }


    /**
     * Método para contar alertas no leidas
     */
    public static function contarNoLeidas(): int
    {
        return Alerta::noLeidas()->count();
    }
}
