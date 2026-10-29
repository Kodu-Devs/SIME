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

        //Generar y actualizar alertas para extintores
        $extintores = Extintor::with('tipoextintor', 'ubicacion')->get();
        foreach ($extintores as $e) {
            AlertaService::evaluarExtintor($e);
        }

        //Generar y actualizar alertas para mantenimientos
        $mantenimiento = Mantenimiento::with('extintor')->get();
        foreach ($mantenimiento as $m) {
            AlertaService::evaluarMantenimiento($m);
        }

        //Generar y actualizar alertas para capacitaciones
        $capacitaciones = Capacitacion::with('ubicacion')->get();
        foreach ($capacitaciones as $c) {
            AlertaService::evaluarCapacitacion($c);
        }

        $this->info("Se ha finalizado el proceso");
    }
}
