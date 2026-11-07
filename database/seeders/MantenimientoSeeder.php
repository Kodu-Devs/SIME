<?php

namespace Database\Seeders;

use App\Models\Extintor;
use App\Models\Mantenimiento;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MantenimientoSeeder extends Seeder
{
    public function run(): void
    {
        $extintores = Extintor::orderBy('id')->take(5)->get();

        if ($extintores->isEmpty()) {
            return;
        }

        // Definimos compensaciones (días y horas a sumar después de la instalación) en vez de fechas fijas
        $datosFijos = [
            ['tipo' => 'Revisión', 'descripcion' => 'Revisión trimestral rutinaria', 'add_days' => 10, 'add_hours' => 2],
            ['tipo' => 'Relleno de contenido', 'descripcion' => 'Recarga por uso parcial', 'add_days' => 45, 'add_hours' => 3],
            ['tipo' => 'Otra', 'descripcion' => 'Reemplazo de válvula', 'add_days' => 90, 'add_hours' => 0, 'pendiente' => true],
            ['tipo' => 'Revisión', 'descripcion' => 'Revisión preventiva', 'add_days' => 15, 'add_hours' => 1],
            ['tipo' => 'Relleno de contenido', 'descripcion' => 'Recarga anual obligatoria', 'add_days' => 365, 'add_hours' => 2],
            ['tipo' => 'Otra', 'descripcion' => 'Reemplazo de etiqueta', 'add_days' => 120, 'add_hours' => 0, 'pendiente' => true],
            ['tipo' => 'Revisión', 'descripcion' => 'Revisión mensual', 'add_days' => 30, 'add_hours' => 1],
            ['tipo' => 'Relleno de contenido', 'descripcion' => 'Recarga por caducidad del agente', 'add_days' => 400, 'add_hours' => 4],
            ['tipo' => 'Otra', 'descripcion' => 'Reemplazo de cilindro', 'add_days' => 150, 'add_hours' => 0, 'pendiente' => true],
            ['tipo' => 'Revisión', 'descripcion' => 'Revisión de rutina', 'add_days' => 60, 'add_hours' => 2],
            ['tipo' => 'Relleno de contenido', 'descripcion' => 'Recarga post-incidente', 'add_days' => 200, 'add_hours' => 5],
            ['tipo' => 'Otra', 'descripcion' => 'Reemplazo de soporte', 'add_days' => 80, 'add_hours' => 0, 'pendiente' => true],
            ['tipo' => 'Revisión', 'descripcion' => 'Revisión inicial del año', 'add_days' => 5, 'add_hours' => 1],
            ['tipo' => 'Relleno de contenido', 'descripcion' => 'Recarga preventiva', 'add_days' => 250, 'add_hours' => 3],
            ['tipo' => 'Otra', 'descripcion' => 'Reemplazo de manómetro', 'add_days' => 180, 'add_hours' => 0, 'pendiente' => true],
        ];

        $contador = 0;
        foreach ($datosFijos as $data) {
            $extintor = $extintores[$contador % $extintores->count()];
            
            $fechaInstalacion = Carbon::parse($extintor->fecha_instalacion);
            
            // Asegurarnos que la fecha generada no sobrepase el día de hoy
            $fechaProgramada = $fechaInstalacion->copy()->addDays($data['add_days'])->setTime(10, 0);
            if ($fechaProgramada->isFuture()) {
                $fechaProgramada = now()->subDays(2)->setTime(10, 0);
            }

            $fechaRealizada = isset($data['pendiente']) && $data['pendiente'] 
                ? null 
                : $fechaProgramada->copy()->addHours($data['add_hours']);

            Mantenimiento::withTrashed()->firstOrCreate(
                [
                    'extintor_id' => $extintor->getKey(),
                    'descripcion' => $data['descripcion'],
                ],
                [
                    'tipo' => $data['tipo'],
                    'fecha_programada' => $fechaProgramada,
                    'fecha_realizada' => $fechaRealizada,
                ]
            );

            $contador++;
        }

        $proximos = [
            ['tipo' => 'Revisión', 'descripcion' => 'Revisión trimestral programada', 'dias' => 10, 'hora' => 10],
            ['tipo' => 'Relleno de contenido', 'descripcion' => 'Recarga programada', 'dias' => 18, 'hora' => 9],
            ['tipo' => 'Revisión', 'descripcion' => 'Revisión preventiva programada', 'dias' => 25, 'hora' => 11],
        ];

        foreach ($proximos as $indice => $data) {
            $extintor = $extintores[$indice % $extintores->count()];

            Mantenimiento::withTrashed()->updateOrCreate(
                [
                    'extintor_id' => $extintor->getKey(),
                    'descripcion' => $data['descripcion'],
                ],
                [
                    'tipo' => $data['tipo'],
                    'fecha_programada' => now()->startOfDay()->addDays($data['dias'])->setTime($data['hora'], 0),
                    'fecha_realizada' => null,
                ]
            );
        }
    }
}