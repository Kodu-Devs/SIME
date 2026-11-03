<?php

namespace Database\Seeders;

use App\Models\Capacitacion;
use App\Models\EventoUso;
use App\Models\Extintor;
use App\Models\User;
use Database\Factories\EventoUsoFactory;
use Illuminate\Database\Seeder;

class EstresEventoUsoSeeder extends Seeder
{
    // Cuántos eventos ESTRES- se generan (configurable).
    private const CANTIDAD = 6000;

    // Porcentaje de eventos que vienen de una capacitación.
    private const PORCENTAJE_CAPACITACION = 30;

    public function run(): void
    {
        if (Extintor::count() === 0) {
            $this->command->warn('Saltando EstresEventoUsoSeeder: No hay extintores. Corre primero migrate:fresh --seed.');

            return;
        }

        if (User::count() === 0) {
            $this->command->warn('Saltando EstresEventoUsoSeeder: No hay usuarios. Corre primero migrate:fresh --seed.');

            return;
        }

        EventoUsoFactory::reiniciarCache();

        // Solo capacitaciones ya pasadas (el evento no puede quedar en el futuro).
        $capacitaciones = Capacitacion::where('fecha_hora', '<=', now()->subDay())->get(['id', 'fecha_hora']);

        $conCapacitacion = 0;

        if ($capacitaciones->isEmpty()) {
            $this->command->warn('No hay capacitaciones pasadas: todos los eventos saldrán sin capacitación.');
        } else {
            $conCapacitacion = intdiv(self::CANTIDAD * self::PORCENTAJE_CAPACITACION, 100);
        }

        $sinCapacitacion = self::CANTIDAD - $conCapacitacion;

        EventoUso::factory()->count($sinCapacitacion)->create();

        if ($conCapacitacion > 0) {
            EventoUso::factory()->count($conCapacitacion)->deCapacitacion($capacitaciones)->create();
        }

        $total = EventoUso::where('motivo', 'like', 'ESTRES-%')->count();
        $this->command->info("Eventos de uso ESTRES- en la base: {$total}.");
    }
}