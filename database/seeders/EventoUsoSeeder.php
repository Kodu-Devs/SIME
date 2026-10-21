<?php

namespace Database\Seeders;

use App\Models\Capacitacion;
use App\Models\EventoUso;
use App\Models\Extintor;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class EventoUsoSeeder extends Seeder
{
    public function run(): void
    {
        // Se seleccionan por posición (id) tal como marcan las reglas del equipo
        $admin = User::orderBy('id')->first();
        $extintor = Extintor::orderBy('id')->first();

        if (!$admin || !$extintor) {
            $this->command->warn('EventoUsoSeeder omitido: Faltan usuarios o extintores.');
            return;
        }

        $capacitaciones = Capacitacion::orderBy('id')->get();

        $ejemplos = [
            ['motivo' => 'Práctica de capacitación controlada', 'tipo_descarga' => 'parcial', 'offset_dias' => 1],
            ['motivo' => 'Capacitación de brigada interna', 'tipo_descarga' => 'parcial', 'offset_dias' => 2],
            ['motivo' => 'Simulacro de evacuación trimestral', 'tipo_descarga' => 'parcial', 'offset_dias' => 0],
            ['motivo' => 'Conato de incendio controlado en prácticas', 'tipo_descarga' => 'parcial', 'offset_dias' => 3],
            ['motivo' => 'Incendio real atendido en área de cocina', 'tipo_descarga' => 'total', 'offset_dias' => 1],
            ['motivo' => 'Descarga accidental durante maniobras', 'tipo_descarga' => 'total', 'offset_dias' => 2],
            ['motivo' => 'Uso en emergencia real imprevista', 'tipo_descarga' => 'total', 'offset_dias' => 0],
        ];

        foreach ($ejemplos as $index => $ejemplo) {
            $capacitacion = $capacitaciones[$index] ?? null;

            if ($capacitacion && $capacitacion->fecha_hora) {
                $fechaUso = Carbon::parse($capacitacion->fecha_hora)->addDays($ejemplo['offset_dias']);
            } else {
                $fechaUso = Carbon::now()->subDays(10 - $index);
            }

            EventoUso::updateOrCreate(
                [
                    'extintor_id' => $extintor->id,
                    'motivo'      => $ejemplo['motivo'],
                ],
                [
                    'user_id'         => $admin->id,
                    'fecha'           => $fechaUso,
                    'tipo_descarga'   => $ejemplo['tipo_descarga'],
                    'capacitacion_id' => $capacitacion ? $capacitacion->id : null,
                ]
            );
        }
    }
}