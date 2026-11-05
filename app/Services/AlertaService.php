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
        //Bloque vencimiento
        if ($estado == 'vencido') {
            self::cerrarPara('extintor_id', $e->id, 'por_vencer'); //Cierra alertas anteriores sobre por_vencer
            self::generar('extintor_id', $e->id, 'Urgente', 'vencido', 'Extintor vencido');
        } elseif ($estado == 'por_vencer') {
            self::cerrarPara('extintor_id', $e->id, 'vencido'); //Cierra el vencido si se reprogramo
            self::generar('extintor_id', $e->id, 'Próximo', 'por_vencer', 'Extintor por vencer');
        } elseif ($estado == 'vigente') {
            self::cerrarPara('extintor_id', $e->id, 'vencido'); //Cerrar alertas anteriores al estar vigente
            self::cerrarPara('extintor_id', $e->id, 'por_vencer');
        }


        //Bloque estatus
        if ($e->estatus == 'Vacío' || $e->estatus == 'Fuera de servicio') {
            self::generar('extintor_id', $e->id, 'Urgente', 'estatus', 'Extintor vacío o fuera de servicio');
        } else {
            self::cerrarPara('extintor_id', $e->id, 'estatus'); //Si esta disponible o medio uso
        }
    }


    /**
     * Método para evaluar un mantenimiento
     */
    public static function evaluarMantenimiento(Mantenimiento $m)
    {
        //Validar si ya tiene fecha realizada para cerrar
        if ($m->fecha_realizada !== null) {
            self::cerrarPara('mantenimiento_id', $m->id, 'mantenimiento');
            return;
        }

        //Validación y logica para mantenimientos
        $fecha_hoy = today();
        $fecha_programada = Carbon::parse($m->fecha_programada)->startOfDay();
        $limit = $fecha_hoy->copy()->addDays(config('sime.dias_por_vencer'));

        if ($fecha_programada->lessThan($fecha_hoy) && $m->fecha_realizada == null) {
            //Cerrar alertas para mantenimientos proximos
            Alerta::where('mantenimiento_id', $m->id)->where('categoria', 'mantenimiento')->where('tipo', 'Próximo')->noLeidas()->update(['leida' => true]);
            self::generar('mantenimiento_id', $m->id, 'Urgente', 'mantenimiento', 'Mantenimiento atrasado');
        } elseif ($fecha_programada->betweenIncluded($fecha_hoy, $limit)) {
            //Cerrar alertas para mantenimientos Urgentes
            Alerta::where('mantenimiento_id', $m->id)->where('categoria', 'mantenimiento')->where('tipo', 'Urgente')->noLeidas()->update(['leida' => true]);
            self::generar('mantenimiento_id', $m->id, 'Próximo', 'mantenimiento', 'Mantenimiento próximo');
        }
    }


    /**
     * Método para evaluar una capacitacion
     */
    public static function evaluarCapacitacion(Capacitacion $c)
    {
        $fecha_hora = Carbon::parse($c->fecha_hora)->startOfDay();
        $fecha_hoy = today();
        $limit = $fecha_hoy->copy()->addDays(3);

        //Validación y logica para capacitaciones
        if ($fecha_hora->betweenIncluded($fecha_hoy, $limit)) {
            self::generar('capacitacion_id', $c->id, 'Informativo', 'capacitacion', 'Capacitación próxima');
        } else {
            //Si pasó la fecha o se reprograma
            self::cerrarPara('capacitacion_id', $c->id, 'capacitacion');
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
    public static function cerrarPara(string $campo, int $valor, ?string $categoria = null)
    {
        DB::transaction(function () use ($campo, $valor, $categoria) {
            Alerta::where($campo, $valor)->when($categoria, fn($q) => $q->where('categoria', $categoria))->noLeidas()->update(['leida' => true]);
        });
    }


    /**
     * Método para contar alertas no leidas
     */
    public static function contarNoLeidas(): int
    {
        return Alerta::noLeidas()->count();
    }


    /**
     * Método para resumenCampana
     */
    public static function resumenCampana()
    {
        $query = Alerta::noLeidas();

        $noLeidas = (clone $query)->count(); //Contar las no leidas
        $porTipo = (clone $query)->selectRaw('tipo, count(*) as total')->groupBy('tipo')->pluck('total', 'tipo'); //Contar por tipo de alerta

        $recientes = (clone $query)->with([
            'extintor.ubicacion.piso.instalacion',
            'mantenimiento.extintor.ubicacion.piso.instalacion',
            'capacitacion.ubicacion.piso.instalacion'
        ])->orderBy('fecha_generada', 'desc')->orderBy('id', 'desc')->take(5)
            ->get()->map(function ($a) {
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
            });
        return ['no_leidas' => $noLeidas, 'por_tipo' => $porTipo, 'recientes' => $recientes];
    }
}
