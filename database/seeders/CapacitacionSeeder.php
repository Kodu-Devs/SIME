<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Capacitacion;
use App\Models\Ubicacion;

class CapacitacionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Validación FUERA del ciclo. Preguntamos una sola vez.
        if (Ubicacion::count() === 0) {
            $this->command->warn('Saltando CapacitacionSeeder: No hay ubicaciones. Corre primero UbicacionSeeder.');
            return;
        }

        $capacitaciones = [
            ['Uso y manejo de extintores',       '2026-03-10 09:00:00'],
            ['Brigada de primeros auxilios',     '2026-04-15 10:30:00'],
            ['Simulacro de evacuación',          '2026-05-20 11:00:00'],
            ['Prevención de incendios',          '2026-08-12 09:30:00'],
            ['Actualización de brigadas',        '2026-11-05 10:00:00'],
            ['Capacitación para nuevo personal', '2026-12-02 12:00:00'],
        ];

        foreach ($capacitaciones as [$nombre, $fechaHora]) {
            // Obtenemos una ubicación aleatoria para cada capacitación
            $ubicacion = Ubicacion::inRandomOrder()->first();

            Capacitacion::updateOrCreate(
                ['nombre' => $nombre, 'fecha_hora' => $fechaHora],
                // Nota: Asegúrate de que la llave primaria de Ubicacion sea 'id' y no 'ubicacion_id'
                ['ubicacion_id' => $ubicacion->id]
            );
        }

        $this->command->info('Capacitaciones sembradas con éxito.');
    }
}