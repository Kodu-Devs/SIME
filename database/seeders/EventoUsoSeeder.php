<?php

namespace Database\Seeders;

use App\Models\Capacitacion;
use App\Models\EventoUso;
use App\Models\Extintor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class EventoUsoSeeder extends Seeder
{
    public function run(): void
    {
        // Se seleccionan por posición (id) tal como marcan las reglas del equipo
        $admin = User::orderBy('id')->first();
        $extintor = Extintor::orderBy('id')->first();

        if (! $admin || ! $extintor) {
            $this->command->warn('EventoUsoSeeder omitido: Faltan usuarios o extintores.');
            return;
        }

        // withTrashed: sin las capacitaciones dadas de baja la lista se recorre y
        // updateOrCreate reasignaria los eventos existentes a otra capacitacion
        $capacitaciones = Capacitacion::withTrashed()->orderBy('id')->get();

        // Le agregué el 'tipo_motivo' base a cada uno para que no quede nulo cuando no hay capacitación.
        $ejemplos = [
            ['motivo' => 'Práctica de capacitación controlada', 'tipo_motivo' => 'Capacitación', 'tipo_descarga' => 'parcial', 'offset_dias' => 1],
            ['motivo' => 'Capacitación de brigada interna', 'tipo_motivo' => 'Capacitación', 'tipo_descarga' => 'parcial', 'offset_dias' => 2],
            ['motivo' => 'Simulacro de evacuación trimestral', 'tipo_motivo' => 'Simulacro', 'tipo_descarga' => 'parcial', 'offset_dias' => 0],
            ['motivo' => 'Conato de incendio controlado en prácticas', 'tipo_motivo' => 'Conato', 'tipo_descarga' => 'parcial', 'offset_dias' => 3],
            ['motivo' => 'Incendio real atendido en área de cocina', 'tipo_motivo' => 'Conato', 'tipo_descarga' => 'total', 'offset_dias' => 1],
            ['motivo' => 'Descarga accidental durante maniobras', 'tipo_motivo' => 'Otro', 'tipo_descarga' => 'total', 'offset_dias' => 2],
            ['motivo' => 'Uso en emergencia real imprevista', 'tipo_motivo' => 'Conato', 'tipo_descarga' => 'total', 'offset_dias' => 0],
        ];

        foreach ($ejemplos as $index => $ejemplo) {
            $capacitacion = $capacitaciones[$index] ?? null;

            if ($capacitacion && $capacitacion->fecha_hora) {
                $fechaUso = Carbon::parse($capacitacion->fecha_hora)->addDays($ejemplo['offset_dias']);
            } else {
                $fechaUso = Carbon::now()->subDays(10 - $index);
            }

            $tipoMotivoFinal = $capacitacion ? 'Capacitación' : $ejemplo['tipo_motivo'];

            EventoUso::updateOrCreate(
                [
                    'extintor_id' => $extintor->id,
                    'motivo' => $ejemplo['motivo'],
                ],
                [
                    'user_id' => $admin->id,
                    'fecha' => $fechaUso,
                    'tipo_motivo' => $tipoMotivoFinal, // Inyectamos la nueva columna
                    'tipo_descarga' => $ejemplo['tipo_descarga'],
                    'capacitacion_id' => $capacitacion ? $capacitacion->id : null,
                ]
            );
        }
    }
}