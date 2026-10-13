<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Alerta;
use App\Models\Extintor;
use App\Models\User;
use Carbon\Carbon;

class AlertaSeeder extends Seeder
{
    public function run(): void
    {
        // Busca el usuario admin (o toma el primer usuario en la base de datos)
        $admin = User::where('role', 'admin')->first() ?? User::first();
        $userId = $admin ? $admin->id : 1;

        // Toma el primer extintor registrado para relacionarlo
        $extintor = Extintor::first();
        $extintorId = $extintor ? $extintor->extintor_id : 1;

        $alertas = [
            [
                'extintor_id'    => $extintorId,
                'user_id'        => $userId,
                'tipo'           => 'Urgente',
                'mensaje'        => 'Extintor sin presión y con fecha de recarga vencida.',
                'fecha_generada' => Carbon::now()->subDays(3),
                'leida'          => false,
            ],
            [
                'extintor_id'    => $extintorId,
                'user_id'        => $userId,
                'tipo'           => 'Urgente',
                'mensaje'        => 'Extintor reportado como vacío .',
                'fecha_generada' => Carbon::now()->subHours(4),
                'leida'          => false,
            ],
            [
                'extintor_id'    => $extintorId,
                'user_id'        => $userId,
                'tipo'           => 'Próximo',
                'mensaje'        => 'Mantenimiento preventivo programado para la próxima semana.',
                'fecha_generada' => Carbon::now()->subDays(1),
                'leida'          => false,
            ],
            [
                'extintor_id'    => $extintorId,
                'user_id'        => $userId,
                'tipo'           => 'Próximo',
                'mensaje'        => 'Extintor próximo a vencer en los siguientes 15 días.',
                'fecha_generada' => Carbon::now()->subDays(5),
                'leida'          => true,
            ],
            [
                'extintor_id'    => $extintorId,
                'user_id'        => $userId,
                'tipo'           => 'Informativo',
                'mensaje'        => 'Inspección de rutina completada correctamente.',
                'fecha_generada' => Carbon::now()->subHours(12),
                'leida'          => true,
            ],
        ];

        foreach ($alertas as $alerta) {
        Alerta::firstOrCreate(
            // 1. Criterios de búsqueda (para comprobar si la alerta ya existe)
            [
                'extintor_id' => $alerta['extintor_id'],
                'mensaje'     => $alerta['mensaje'],
            ],
            // 2. Valores que se guardarán si NO existe
            $alerta
        );
        }
    }
}

