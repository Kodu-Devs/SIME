<?php

namespace Database\Seeders;

use App\Models\Capacitacion;
use App\Models\EventoUso;
use App\Models\Extintor;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventoUsoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();
        if (!$admin) {
            $this->command->warn('Saltando EventoUsoSeeder: No hay usuarios. Corre primero AdminSeeder.');
            return;
        }
        $casos = [
            ['parcial', true, 'Práctica de capacitación'],
            ['parcial', true, 'Capacitación de brigada'],
            ['parcial', false, 'Simulacro de evacuación'],
            ['parcial', false, 'Conato de incendio controlado'],
            ['total', false, 'Incendio en cocina'],
            ['total', false, 'Descarga accidental'],
            ['total', false, 'Uso en emergencia real'],
        ];

        foreach ($casos as [$tipo, $conCapacitacion, $motivo]) {
            $estatus = $tipo === 'total' ? 'Vacío' : 'Medio uso';

            $extintor = Extintor::where('estatus', $estatus)
                ->inRandomOrder()
                ->first();

            if (!$extintor) {
                $this->command->warn("No hay extintor en estatus '$estatus' para el motivo '$motivo'. Se salta.");
                continue;
            }

            $capacitacion = $conCapacitacion
                ? Capacitacion::inRandomOrder()->first()
                : null;

            EventoUso::updateOrCreate(
                [
                    'extintor_id' => $extintor->id, 
                    'motivo'      => $motivo,
                ],
                [
                    'user_id'         => $admin->id,
                    'tipo_descarga'   => $tipo,
                    'capacitacion_id' => $capacitacion?->id,
                    'fecha'           => now()->subDays(rand(1, 90)),
                ]
            );
        }
        
        $this->command->info('Eventos de uso sembrados correctamente.');
    }
}