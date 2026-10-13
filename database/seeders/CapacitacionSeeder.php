<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Capacitacion;
use App\Models\Ubicacion;

class CapacitacionSeeder extends Seeder
{
    public function run(): void
    {

        $capacitaciones = [
            ['Uso y manejo de extintores',       '2026-03-10 09:00:00'],
            ['Brigada de primeros auxilios',     '2026-04-15 10:30:00'],
            ['Simulacro de evacuación',          '2026-05-20 11:00:00'],
            ['Prevención de incendios',          '2026-08-12 09:30:00'],
            ['Actualización de brigadas',        '2026-11-05 10:00:00'],
            ['Capacitación para nuevo personal', '2026-12-02 12:00:00'],
        ];

        foreach ($capacitaciones as [$nombre, $fechaHora]) {

            $ubicacion = Ubicacion::inRandomOrder()->first();
            if (!$ubicacion) {
                $this->command->warn('No hay ubicaciones: corre primero UbicacionSeeder.');
                return;
            }


            Capacitacion::firstOrCreate(
                ['nombre' => $nombre, 'fecha_hora' => $fechaHora],
                ['ubicacion_id' => $ubicacion->id]
            );
        }
    }
}

