<?php

namespace Database\Seeders;

use App\Models\Alerta;
use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AlertaSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();

        if (! $admin) {
            $this->command->warn('AlertaSeeder omitido: No hay usuarios registrados aún.');

            return;
        }

        // Se usan los modelos en lugar de DB::table() para que tomen su $table real
        // (la tabla es 'tipo_extintor', no 'tipos_extintor', y por eso fallaba db:seed).
        $tipoId = TipoExtintor::orderBy('id')->value('id');
        $ubicacionId = Ubicacion::orderBy('id')->value('id');

        // Antes habia un fallback a id 1 que rompia la llave foranea si las tablas
        // estaban vacias; mejor avisar y salir como hacen los demas seeders.
        if (! $tipoId || ! $ubicacionId) {
            $this->command->warn('AlertaSeeder omitido: Faltan tipos de extintor o ubicaciones.');

            return;
        }

        // Los DEMO siguen la revisión mensual: la instalación cae 6 meses antes y
        // el mismo día del mes que el vencimiento (relativo a hoy, como ExtintorSeeder).
        $hoy = Carbon::now()->startOfDay();

        $vencimientoVencido = $this->diaSeguro($hoy->copy()->subDays(10), true);
        $vencimientoVacio = $this->diaSeguro($hoy->copy()->addDays(20), false);
        $vencimientoPorVencer = $this->diaSeguro($hoy->copy()->addDays(3), false);

        // Columnas reales de extintores: 'tipoextintor_id' y 'fecha_vencimiento'.
        // 'fecha_instalacion' y 'capacidad' son NOT NULL, por eso se incluyen.
        $extVencido = Extintor::firstOrCreate(
            ['etiqueta_inventario' => 'DEMO-VENCIDO'],
            [
                'tipoextintor_id' => $tipoId,
                'ubicacion_id' => $ubicacionId,
                'estatus' => 'Disponible',
                'fecha_instalacion' => $vencimientoVencido->copy()->subMonthsNoOverflow(6)->toDateString(),
                'fecha_vencimiento' => $vencimientoVencido->toDateString(),
                'capacidad' => '9 kg',
            ]
        );

        $extVacio = Extintor::firstOrCreate(
            ['etiqueta_inventario' => 'DEMO-VACIO'],
            [
                'tipoextintor_id' => $tipoId,
                'ubicacion_id' => $ubicacionId,
                'estatus' => 'Vacío',
                'fecha_instalacion' => $vencimientoVacio->copy()->subMonthsNoOverflow(6)->toDateString(),
                'fecha_vencimiento' => $vencimientoVacio->toDateString(),
                'capacidad' => '9 kg',
            ]
        );

        $extPorVencer = Extintor::firstOrCreate(
            ['etiqueta_inventario' => 'DEMO-POR-VENCER'],
            [
                'tipoextintor_id' => $tipoId,
                'ubicacion_id' => $ubicacionId,
                'estatus' => 'Disponible',
                'fecha_instalacion' => $vencimientoPorVencer->copy()->subMonthsNoOverflow(6)->toDateString(),
                'fecha_vencimiento' => $vencimientoPorVencer->toDateString(),
                'capacidad' => '9 kg',
            ]
        );

        $alertas = [
            [
                'extintor_id' => $extVencido->id,
                'user_id' => $admin->id,
                'tipo' => 'Urgente',
                'categoria' => 'vencido',
                'mensaje' => "Extintor {$extVencido->etiqueta_inventario} sin presión y con fecha de recarga vencida desde el {$extVencido->fecha_vencimiento}.",
                'fecha_generada' => Carbon::now()->subDays(3),
                'leida' => false,
            ],
            [
                'extintor_id' => $extVacio->id,
                'user_id' => $admin->id,
                'tipo' => 'Urgente',
                'categoria' => 'estatus',
                'mensaje' => "Extintor {$extVacio->etiqueta_inventario} reportado como {$extVacio->estatus}.",
                'fecha_generada' => Carbon::now()->subHours(4),
                'leida' => false,
            ],
            [
                'extintor_id' => $extPorVencer->id,
                'user_id' => $admin->id,
                'tipo' => 'Próximo',
                'categoria' => 'por_vencer',
                'mensaje' => "Extintor {$extPorVencer->etiqueta_inventario} próximo a vencer el {$extPorVencer->fecha_vencimiento}.",
                'fecha_generada' => Carbon::now()->subDays(5),
                'leida' => true,
            ],
        ];

        foreach ($alertas as $alerta) {
            Alerta::firstOrCreate(
                [
                    'extintor_id' => $alerta['extintor_id'],
                    'tipo' => $alerta['tipo'],
                    'categoria' => $alerta['categoria'],
                ],
                $alerta
            );
        }
    }

    /**
     * Los días 29, 30 y 31 no existen en todos los meses y correrían el
     * vencimiento unos días. Se usa un día seguro (máximo 28).
     */
    private function diaSeguro(Carbon $fecha, bool $haciaAtras): Carbon
    {
        if ($fecha->day <= 28) {
            return $fecha->copy();
        }

        return $haciaAtras
            ? $fecha->copy()->day(28)
            : $fecha->copy()->addMonthsNoOverflow(1)->startOfMonth();
    }
}
