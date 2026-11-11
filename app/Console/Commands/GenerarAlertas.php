<?php

namespace App\Console\Commands;

use App\Models\Capacitacion;
use App\Models\Extintor;
use App\Models\Mantenimiento;
use App\Services\AlertaService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('alertas:generar')]
#[Description('Genera y actualiza las alertas para extintores, mantenimientos y capacitaciones')]
class GenerarAlertas extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Se ha iniciado el proceso de generación de alertas");

        //Consulta de extintores
        $vencidos = Extintor::vencidos()->get();
        $porVencer = Extintor::porVencer()->get();
        $estatus = Extintor::whereIn('estatus', ['Vacío', 'Fuera de servicio'])->get();
        $conAlertas = Extintor::whereHas('alertas', fn($q) => $q->noLeidas())->get(); //Extintores con alertas vigentes y no leidas

        //Generar y actualizar alertas para extintores
        $extintores = $vencidos->concat($porVencer)->concat($estatus)->concat($conAlertas)->unique('id');
        foreach ($extintores as $e) {
            AlertaService::evaluarExtintor($e);
        }


        //Generar y actualizar alertas para mantenimientos
        $mantenimientoPendientes = Mantenimiento::where('fecha_realizada', NULL)->get();
        $mantenimientoConAlertas = Mantenimiento::whereHas('alertas', fn($q) => $q->noLeidas())->get(); //Mantenimientos con alertas vigentes y no leidas

        $mantenimiento = $mantenimientoPendientes->concat($mantenimientoConAlertas)->unique('id');

        foreach ($mantenimiento as $m) {
            AlertaService::evaluarMantenimiento($m);
        }

        //Generar y actualizar alertas para capacitaciones
        $capacitacionesFuturas = Capacitacion::whereDate('fecha_hora', '>=', today())->get();
        $capacitacionesConAlertas = Capacitacion::whereHas('alertas', fn($q) => $q->noLeidas())->get(); //Capacitaciones con alertas vigentes y no leidas

        $capacitaciones = $capacitacionesFuturas->concat($capacitacionesConAlertas)->unique('id');

        foreach ($capacitaciones as $c) {
            AlertaService::evaluarCapacitacion($c);
        }

        $this->info("Se ha finalizado el proceso");
    }
}
