<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mantenimiento; 
use App\Models\Extintor;       
use Carbon\Carbon;

class MantenimientoSeeder extends Seeder
{
    public function run(): void
    {
        if (Extintor::count() === 0) {
            $this->command->warn('Saltando MantenimientoSeeder: No hay extintores registrados.');
            return;
        }

        $tipos = ['Relleno de contenido', 'Revisión', 'Otra'];

        $extintores = Extintor::inRandomOrder()->take(15)->get();
        $indice = 0;

        // CASO 1: Realizados
        for ($i = 0; $i < 5; $i++) {
            $fechaProg = Carbon::now()->subDays(rand(10, 30));
            $extintor = $extintores->get($indice % $extintores->count());
            $indice++;

            Mantenimiento::updateOrCreate(
                // 1. Arreglo de búsqueda: buscamos por extintor y una descripción fija para no duplicar
                [
                    'extintor_id' => $extintor->getKey(), // Usamos getKey() por si tu llave es 'id' o 'extintor_id'
                    'descripcion' => 'Mantenimiento completado correctamente',
                ],
                // 2. Arreglo de actualización
                [
                    'tipo'             => $tipos[array_rand($tipos)],
                    'fecha_programada' => $fechaProg,
                    'fecha_realizada'  => (clone $fechaProg)->addDays(rand(0, 5)),
                ]
            );
        }

        // CASO 2: Pendientes
        for ($i = 0; $i < 5; $i++) {
            $extintor = $extintores->get($indice % $extintores->count());
            $indice++;

            Mantenimiento::updateOrCreate(
                [
                    'extintor_id' => $extintor->getKey(),
                    'descripcion' => 'Mantenimiento agendado',
                ],
                [
                    'tipo'             => $tipos[array_rand($tipos)],
                    'fecha_programada' => Carbon::now()->addDays(rand(5, 20)),
                    'fecha_realizada'  => null,
                ]
            );
        }

        // CASO 3: Atrasados
        for ($i = 0; $i < 5; $i++) {
            $extintor = $extintores->get($indice % $extintores->count());
            $indice++;

            Mantenimiento::updateOrCreate(
                [
                    'extintor_id' => $extintor->getKey(),
                    'descripcion' => 'Atrasado por falta de insumos',
                ],
                [
                    'tipo'             => $tipos[array_rand($tipos)],
                    'fecha_programada' => Carbon::now()->subDays(rand(5, 15)),
                    'fecha_realizada'  => null,
                ]
            );
        }

        $this->command->info('Mantenimientos sembrados con éxito y sin duplicados.');
    }
}