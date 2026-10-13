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
                'mensaje'        => 'Extintor reportado como vacío en la estación de cocina.',
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
            Alerta::create($alerta);
        }
    }
}

/*

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
        // Busca el usuario admin (o toma el primer usuario)
        $admin = User::where('role', 'admin')->first() ?? User::first();
        $userId = $admin ? $admin->id : 1;

        // Obtener todos los IDs de los extintores registrados
        $extintoresIds = Extintor::pluck('extintor_id')->toArray();

        // Si no hay extintores en la BD, se usa el ID 1 por defecto
        if (empty($extintoresIds)) {
            $extintoresIds = [1];
        }

        $alertas = [
            [
                'tipo'           => 'Urgente',
                'mensaje'        => 'Extintor sin presión y con fecha de recarga vencida.',
                'fecha_generada' => Carbon::now()->subDays(3),
                'leida'          => false,
            ],
            [
                'tipo'           => 'Urgente',
                'mensaje'        => 'Extintor reportado como vacío en la estación de cocina.',
                'fecha_generada' => Carbon::now()->subHours(4),
                'leida'          => false,
            ],
            [
                'tipo'           => 'Próximo',
                'mensaje'        => 'Mantenimiento preventivo programado para la próxima semana.',
                'fecha_generada' => Carbon::now()->subDays(1),
                'leida'          => false,
            ],
            [
                'tipo'           => 'Próximo',
                'mensaje'        => 'Extintor próximo a vencer en los siguientes 15 días.',
                'fecha_generada' => Carbon::now()->subDays(5),
                'leida'          => true,
            ],
            [
                'tipo'           => 'Informativo',
                'mensaje'        => 'Inspección de rutina completada correctamente.',
                'fecha_generada' => Carbon::now()->subHours(12),
                'leida'          => true,
            ],
        ];

        foreach ($alertas as $index => $alerta) {
            // Asigna las alertas de forma cíclica entre los extintores existentes
            $alerta['extintor_id'] = $extintoresIds[$index % count($extintoresIds)];
            $alerta['user_id']     = $userId;

            Alerta::create($alerta);
        }
    }
}

*/