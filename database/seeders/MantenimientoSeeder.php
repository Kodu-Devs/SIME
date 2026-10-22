<?php

namespace Database\Seeders;

use App\Models\Extintor;
use App\Models\Mantenimiento;
use Illuminate\Database\Seeder;

class MantenimientoSeeder extends Seeder
{
    public function run(): void
    {
        $extintores = Extintor::orderBy('id')->take(5)->get();

        if ($extintores->isEmpty()) {
            return;
        }

        $datosFijos = [
            ['tipo' => 'revision', 'descripcion' => 'Revisión trimestral rutinaria', 'fecha_programada' => '2026-01-10 10:00:00', 'fecha_realizada' => '2026-01-10 10:30:00'],
            ['tipo' => 'recarga', 'descripcion' => 'Recarga por uso parcial', 'fecha_programada' => '2026-03-15 09:00:00', 'fecha_realizada' => '2026-03-15 11:00:00'],
            ['tipo' => 'reemplazo', 'descripcion' => 'Reemplazo de válvula', 'fecha_programada' => '2026-06-20 12:00:00', 'fecha_realizada' => null],
            ['tipo' => 'revision', 'descripcion' => 'Revisión preventiva', 'fecha_programada' => '2026-01-12 10:00:00', 'fecha_realizada' => '2026-01-12 10:15:00'],
            ['tipo' => 'recarga', 'descripcion' => 'Recarga anual obligatoria', 'fecha_programada' => '2026-02-18 08:30:00', 'fecha_realizada' => '2026-02-18 10:00:00'],
            ['tipo' => 'reemplazo', 'descripcion' => 'Reemplazo de etiqueta', 'fecha_programada' => '2026-05-10 14:00:00', 'fecha_realizada' => null],
            ['tipo' => 'revision', 'descripcion' => 'Revisión mensual', 'fecha_programada' => '2026-01-05 09:00:00', 'fecha_realizada' => '2026-01-05 09:30:00'],
            ['tipo' => 'recarga', 'descripcion' => 'Recarga por caducidad del agente', 'fecha_programada' => '2026-04-10 10:00:00', 'fecha_realizada' => '2026-04-10 12:00:00'],
            ['tipo' => 'reemplazo', 'descripcion' => 'Reemplazo de cilindro', 'fecha_programada' => '2026-07-01 11:00:00', 'fecha_realizada' => null],
            ['tipo' => 'revision', 'descripcion' => 'Revisión de rutina', 'fecha_programada' => '2026-01-20 10:00:00', 'fecha_realizada' => '2026-01-20 10:30:00'],
            ['tipo' => 'recarga', 'descripcion' => 'Recarga post-incidente', 'fecha_programada' => '2026-02-25 15:00:00', 'fecha_realizada' => '2026-02-25 16:30:00'],
            ['tipo' => 'reemplazo', 'descripcion' => 'Reemplazo de soporte', 'fecha_programada' => '2026-08-12 09:00:00', 'fecha_realizada' => null],
            ['tipo' => 'revision', 'descripcion' => 'Revisión inicial del año', 'fecha_programada' => '2026-01-02 08:00:00', 'fecha_realizada' => '2026-01-02 08:45:00'],
            ['tipo' => 'recarga', 'descripcion' => 'Recarga preventiva', 'fecha_programada' => '2026-03-30 11:00:00', 'fecha_realizada' => '2026-03-30 13:00:00'],
            ['tipo' => 'reemplazo', 'descripcion' => 'Reemplazo de manómetro', 'fecha_programada' => '2026-09-05 10:00:00', 'fecha_realizada' => null],
        ];

        $contador = 0;
        foreach ($datosFijos as $data) {
            $extintor = $extintores[$contador % $extintores->count()];

            // withTrashed: con SoftDeletes, firstOrCreate no ve los mantenimientos
            // dados de baja y crearia un duplicado; asi la baja se respeta y no se repite
            Mantenimiento::withTrashed()->firstOrCreate(
                [
                    'extintor_id' => $extintor->getKey(),
                    'fecha_programada' => $data['fecha_programada'],
                ],
                [
                    'tipo' => $data['tipo'],
                    'descripcion' => $data['descripcion'],
                    'fecha_realizada' => $data['fecha_realizada'],
                ]
            );

            $contador++;
        }
    }
}
