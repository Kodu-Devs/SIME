<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Mantenimiento; 
use App\Models\Extintor;       
use Carbon\Carbon;

class MantenimientoSeeder extends Seeder
{
    public function run(): void
    {
        // Si no hay extintores en la BD, no podemos correr este seeder
        if (Extintor::count() === 0) {
            return;
        }

        $tipos = ['Relleno de contenido', 'Revisión', 'Otra'];

        // CASO 1: Realizados (fecha realizada no puede ser antes de la programada)
        for ($i = 0; $i < 5; $i++) {
            $fechaProg = Carbon::now()->subDays(rand(10, 30));
            Mantenimiento::create([
                'extintor_id' => Extintor::inRandomOrder()->first()->extintor_id,
                'tipo' => $tipos[array_rand($tipos)],
                'descripcion' => 'Mantenimiento completado correctamente',
                'fecha_programada' => $fechaProg,
                'fecha_realizada' => (clone $fechaProg)->addDays(rand(0, 5)), // Se realizó el mismo día o días después
            ]);
        }

        // CASO 2: Pendientes (null con fecha_programada futura)
        for ($i = 0; $i < 5; $i++) {
            Mantenimiento::create([
                'extintor_id' => Extintor::inRandomOrder()->first()->extintor_id,
                'tipo' => $tipos[array_rand($tipos)],
                'descripcion' => 'Mantenimiento agendado',
                'fecha_programada' => Carbon::now()->addDays(rand(5, 20)), // Fecha en el futuro
                'fecha_realizada' => null, // Pendiente
            ]);
        }

        // CASO 3: Atrasados (null con fecha_programada pasada)
        for ($i = 0; $i < 5; $i++) {
            Mantenimiento::create([
                'extintor_id' => Extintor::inRandomOrder()->first()->extintor_id,
                'tipo' => $tipos[array_rand($tipos)],
                'descripcion' => 'Atrasado por falta de insumos',
                'fecha_programada' => Carbon::now()->subDays(rand(5, 15)), // Fecha en el pasado
                'fecha_realizada' => null, // No se ha hecho
            ]);
        }
    }
}
