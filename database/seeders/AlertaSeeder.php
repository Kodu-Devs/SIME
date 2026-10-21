<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Alerta;
use App\Models\Extintor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AlertaSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();

        if (!$admin) {
            $this->command->warn('AlertaSeeder omitido: No hay usuarios registrados aún.');
            return;
        }

        $tipoId = DB::table('tipos_extintor')->orderBy('id')->value('id') ?? 1;
        $ubicacionId = DB::table('ubicaciones')->orderBy('id')->value('id') ?? 1;

        $extVencido = Extintor::firstOrCreate(
            ['etiqueta_inventario' => 'DEMO-VENCIDO'],
            [
                'tipo_extintor_id'  => $tipoId,
                'ubicacion_id'      => $ubicacionId,
                'estatus'           => 'Disponible',
                'vencimiento_fecha' => Carbon::now()->subDays(10)->toDateString() 
            ]
        );

        $extVacio = Extintor::firstOrCreate(
            ['etiqueta_inventario' => 'DEMO-VACIO'],
            [
                'tipo_extintor_id'  => $tipoId,
                'ubicacion_id'      => $ubicacionId,
                'estatus'           => 'Vacío', 
                'vencimiento_fecha' => Carbon::now()->addMonths(6)->toDateString()
            ]
        );

        $extPorVencer = Extintor::firstOrCreate(
            ['etiqueta_inventario' => 'DEMO-POR-VENCER'],
            [
                'tipo_extintor_id'  => $tipoId,
                'ubicacion_id'      => $ubicacionId,
                'estatus'           => 'Disponible',
                'vencimiento_fecha' => Carbon::now()->addDays(15)->toDateString() 
            ]
        );

        
        $alertas = [
            [
                'extintor_id'    => $extVencido->id,
                'user_id'        => $admin->id,
                'tipo'           => 'Urgente',
                'mensaje'        => "Extintor {$extVencido->etiqueta_inventario} sin presión y con fecha de recarga vencida desde el {$extVencido->vencimiento_fecha}.",
                'fecha_generada' => Carbon::now()->subDays(3),
                'leida'          => false,
            ],
            [
                'extintor_id'    => $extVacio->id,
                'user_id'        => $admin->id,
                'tipo'           => 'Urgente',
                'mensaje'        => "Extintor {$extVacio->etiqueta_inventario} reportado como {$extVacio->estatus}.",
                'fecha_generada' => Carbon::now()->subHours(4),
                'leida'          => false,
            ],
            [
                'extintor_id'    => $extPorVencer->id,
                'user_id'        => $admin->id,
                'tipo'           => 'Próximo',
                'mensaje'        => "Extintor {$extPorVencer->etiqueta_inventario} próximo a vencer el {$extPorVencer->vencimiento_fecha}.",
                'fecha_generada' => Carbon::now()->subDays(5),
                'leida'          => true,
            ],
        ];

        
        foreach ($alertas as $alerta) {
            Alerta::firstOrCreate(
                [
                    
                    'extintor_id' => $alerta['extintor_id'],
                    'tipo'        => $alerta['tipo'],
                ],
                $alerta 
            );
        }
    }
}