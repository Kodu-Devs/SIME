<?php

namespace Database\Seeders;

use App\Models\EventoUso;
use App\Models\Extintor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class EventoUsoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::orderBy('id')->first();

        if (! $admin) {
            $this->command->warn('EventoUsoSeeder omitido: Faltan usuarios.');

            return;
        }

        // Los usos se reparten entre extintores cuyo estatus ya es coherente con la
        // descarga: una parcial deja Medio uso y una total deja Vacío. Se excluyen
        // los DEMO, que pertenecen al AlertaSeeder.
        $medioUso = $this->extintoresConEstatus('Medio uso');
        $vacios = $this->extintoresConEstatus('Vacío');

        if ($medioUso->isEmpty() || $vacios->isEmpty()) {
            $this->command->warn('EventoUsoSeeder omitido: Faltan extintores en Medio uso o Vacío.');

            return;
        }

        $ejemplos = [
            ['motivo' => 'Práctica de capacitación controlada', 'tipo_motivo' => 'Capacitación', 'tipo_descarga' => 'parcial', 'extintor' => 0, 'add_days' => 5, 'hora' => '09:00'],
            ['motivo' => 'Capacitación de brigada interna', 'tipo_motivo' => 'Capacitación', 'tipo_descarga' => 'parcial', 'extintor' => 1, 'add_days' => 12, 'hora' => '11:30'],
            ['motivo' => 'Simulacro de evacuación trimestral', 'tipo_motivo' => 'Simulacro', 'tipo_descarga' => 'parcial', 'extintor' => 2, 'add_days' => 21, 'hora' => '10:00'],
            ['motivo' => 'Conato de incendio controlado en prácticas', 'tipo_motivo' => 'Conato', 'tipo_descarga' => 'parcial', 'extintor' => 0, 'add_days' => 30, 'hora' => '13:15'],
            ['motivo' => 'Incendio real atendido en área de cocina', 'tipo_motivo' => 'Conato', 'tipo_descarga' => 'total', 'extintor' => 0, 'add_days' => 15, 'hora' => '14:20'],
            ['motivo' => 'Descarga accidental durante maniobras', 'tipo_motivo' => 'Otro', 'tipo_descarga' => 'total', 'extintor' => 1, 'add_days' => 45, 'hora' => '16:45'],
            ['motivo' => 'Uso en emergencia real imprevista', 'tipo_motivo' => 'Conato', 'tipo_descarga' => 'total', 'extintor' => 2, 'add_days' => 8, 'hora' => '08:30'],
        ];

        foreach ($ejemplos as $ejemplo) {
            $grupo = $ejemplo['tipo_descarga'] === 'total' ? $vacios : $medioUso;
            $extintor = $grupo[$ejemplo['extintor'] % $grupo->count()];

            [$hora, $minuto] = array_map('intval', explode(':', $ejemplo['hora']));

            // Aseguramos que el uso ocurra después de la instalación del extintor y antes de hoy
            $fechaInstalacion = $extintor->fecha_instalacion ? Carbon::parse($extintor->fecha_instalacion) : now()->subYear();
            $fechaCalculada = $fechaInstalacion->copy()->addDays($ejemplo['add_days'])->setTime($hora, $minuto);
            
            if ($fechaCalculada->isFuture()) {
                $fechaCalculada = now()->subDays(2)->setTime($hora, $minuto);
            }

            EventoUso::updateOrCreate(
                [
                    'extintor_id' => $extintor->id,
                    'motivo' => $ejemplo['motivo'],
                ],
                [
                    'user_id' => $admin->id,
                    'fecha' => $fechaCalculada,
                    'tipo_motivo' => $ejemplo['tipo_motivo'],
                    'tipo_descarga' => $ejemplo['tipo_descarga'],
                    'capacitacion_id' => null,
                ]
            );
        }
    }

    /**
     * @return Collection<int, Extintor>
     */
    private function extintoresConEstatus(string $estatus)
    {
        return Extintor::where('estatus', $estatus)
            ->where('etiqueta_inventario', 'not like', '%-9900%')
            ->orderBy('id')
            ->take(3)
            ->get()
            ->values();
    }
}