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
        // 1. Obtener un usuario y un extintor aleatorios o existentes de forma segura
        $admin = User::first();
        $extintor = Extintor::first();

        // Si no hay usuarios o extintores, evitamos que falle y salimos
        if (!$admin || !$extintor) {
            $this->command->warn('AlertaSeeder omitido: No hay usuarios o extintores registrados aún.');
            return;
        }

        $alertas = [
            [
                'extintor_id'    => $extintor->id, // Usa el ID real del registro encontrado
                'user_id'        => $admin->id,     // Usa el ID real del usuario encontrado
                'tipo'           => 'Urgente',
                'mensaje'        => 'Extintor sin presión y con fecha de recarga vencida.',
                'fecha_generada' => Carbon::now()->subDays(3),
                'leida'          => false,
            ],
            [
                'extintor_id'    => $extintor->id,
                'user_id'        => $admin->id,
                'tipo'           => 'Urgente',
                'mensaje'        => 'Extintor reportado como vacío.',
                'fecha_generada' => Carbon::now()->subHours(4),
                'leida'          => false,
            ],
            [
                'extintor_id'    => $extintor->id,
                'user_id'        => $admin->id,
                'tipo'           => 'Próximo',
                'mensaje'        => 'Mantenimiento preventivo programado para la próxima semana.',
                'fecha_generada' => Carbon::now()->subDays(1),
                'leida'          => false,
            ],
            [
                'extintor_id'    => $extintor->id,
                'user_id'        => $admin->id,
                'tipo'           => 'Próximo',
                'mensaje'        => 'Extintor próximo a vencer en los siguientes 15 días.',
                'fecha_generada' => Carbon::now()->subDays(5),
                'leida'          => true,
            ],
            [
                'extintor_id'    => $extintor->id,
                'user_id'        => $admin->id,
                'tipo'           => 'Informativo',
                'mensaje'        => 'Inspección de rutina completada correctamente.',
                'fecha_generada' => Carbon::now()->subHours(12),
                'leida'          => true,
            ],
        ];

        foreach ($alertas as $alerta) {
            Alerta::updateOrCreate(
                [
                    'extintor_id' => $alerta['extintor_id'],
                    'mensaje'     => $alerta['mensaje'],
                ],
                $alerta
            );
        }
    }
}