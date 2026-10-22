<?php

namespace Database\Seeders;

use App\Models\Extintor;
use App\Models\Instalacion;
use App\Models\Piso;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use Carbon\Carbon;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Seeder;

class ExtintorSeeder extends Seeder
{
    private const FK_PISO_INSTALACION = 'instalacion_id';

    private const FK_UBICACION_PISO = 'piso_id';

    private const PLAN = [
        ['vigente', 'Disponible'],
        ['vigente', 'Disponible'],
        ['por_vencer', 'Disponible'],
        ['vencido', 'Medio uso'],
        ['vigente', 'Medio uso'],
        ['vigente', 'Disponible'],
        ['por_vencer', 'Medio uso'],
        ['vencido', 'Vacío'],
        ['vigente', 'Vacío'],
        ['vigente', 'Disponible'],
        ['vencido', 'Fuera de servicio'],
        ['por_vencer', 'Disponible'],
        ['vigente', 'Fuera de servicio'],
        ['vencido', 'Baja'],
        ['vigente', 'Baja'],
        ['por_vencer', 'Vacío'],
        ['vigente', 'Disponible'],
        ['vencido', 'Baja'],
    ];

    public function run(): void
    {
        $faker = FakerFactory::create('es_MX');
        $faker->seed(2026);

        $hoy = Carbon::now();

        $creados = 0;
        $existentes = 0;
        $omitidos = 0;
        $indice = 0;

        foreach ($this->filasExcel() as $posicion => $fila) {
            $etiqueta = $fila['etiqueta_inventario'];
            $filaExcel = $posicion + 2;

            if (
                $this->vacio($fila['instalacion']) ||
                $this->vacio($fila['piso']) ||
                $this->vacio($fila['ubicacion'])
            ) {
                $this->aviso("Fila {$filaExcel} ({$etiqueta}): sin ubicación completa, se omite.");
                $omitidos++;
                continue;
            }

            if ($this->vacio($fila['tipo'])) {
                $this->aviso("Fila {$filaExcel} ({$etiqueta}): sin tipo de extintor, se omite.");
                $omitidos++;
                continue;
            }

            $tipo = TipoExtintor::where('nombre', $fila['tipo'])->first();

            if (! $tipo) {
                $this->aviso("Fila {$filaExcel} ({$etiqueta}): tipo '{$fila['tipo']}' no encontrado, se omite.");
                $omitidos++;
                continue;
            }

            $instalacion = Instalacion::where('nombre', $fila['instalacion'])->first();

            $piso = $instalacion
                ? Piso::where(self::FK_PISO_INSTALACION, $instalacion->getKey())
                ->where('nombre', $fila['piso'])
                ->first()
                : null;

            $ubicacion = $piso
                ? Ubicacion::where(self::FK_UBICACION_PISO, $piso->getKey())
                ->where('nombre', $fila['ubicacion'])
                ->first()
                : null;

            if (! $ubicacion) {
                $this->aviso("Fila {$filaExcel} ({$etiqueta}): ubicación '{$fila['instalacion']} > {$fila['piso']} > {$fila['ubicacion']}' no encontrada, se omite.");
                $omitidos++;
                continue;
            }

            [$escenario, $estatus] = self::PLAN[$indice % count(self::PLAN)];
            $indice++;

            [$fechaInstalacion, $fechaVencimiento] = $this->generarFechas($escenario, $hoy, $faker);

            if ($fechaVencimiento->lt($hoy) && $estatus === 'Disponible') {
                $estatus = 'Medio uso';
            }

            $extintor = Extintor::firstOrCreate(
                ['etiqueta_inventario' => $etiqueta],
                [
                    'tipoextintor_id'   => $tipo->getKey(),
                    'ubicacion_id'      => $ubicacion->getKey(),
                    'estatus'           => $estatus,
                    'fecha_instalacion' => $fechaInstalacion,
                    'fecha_vencimiento' => $fechaVencimiento,
                    'capacidad'         => $fila['capacidad'],
                ]
            );

            $extintor->wasRecentlyCreated ? $creados++ : $existentes++;
        }

        $this->aviso(
            "ExtintorSeeder finalizado -> creados: {$creados}, ya existentes: {$existentes}, omitidos: {$omitidos}.",
            'info'
        );
    }

    private function generarFechas(string $escenario, Carbon $hoy, $faker): array
    {
        $vencimiento = match ($escenario) {
            'vigente'    => $hoy->copy()->addDays($faker->numberBetween(60, 360)),
            'por_vencer' => $hoy->copy()->addDays($faker->numberBetween(1, 29)),
            'vencido'    => $hoy->copy()->subDays($faker->numberBetween(1, 180)),
        };

        $vencimiento->setTime($faker->numberBetween(8, 17), $faker->randomElement([0, 15, 30, 45]), 0);

        $instalacion = $vencimiento->copy()->subYears($faker->numberBetween(1, 4));

        return [$instalacion, $vencimiento];
    }

    private function vacio(?string $valor): bool
    {
        return trim((string) $valor) === '';
    }

    private function aviso(string $mensaje, string $nivel = 'warn'): void
    {
        if ($this->command) {
            $this->command->{$nivel}($mensaje);
        }
    }

    private function filasExcel(): array
    {
        return [
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00294', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio A', 'piso' => 'Nivel 1', 'ubicacion' => 'Administración'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00295', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio A', 'piso' => 'Nivel 1', 'ubicacion' => 'Escaleras'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00306', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio A', 'piso' => 'Planta baja', 'ubicacion' => 'Escaleras'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00308', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio B', 'piso' => 'Nivel 1', 'ubicacion' => 'Pasillo'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00324', 'tipo' => 'PQS', 'capacidad' => '2 kg', 'instalacion' => 'Parque vehicular', 'piso' => 'Nivel único', 'ubicacion' => 'Estacionamiento'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00366', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio B', 'piso' => 'Planta baja', 'ubicacion' => 'Taller automotriz'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00367', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio B', 'piso' => 'Planta baja', 'ubicacion' => 'Taller automotriz'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00422', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio B', 'piso' => 'Planta baja', 'ubicacion' => 'Taller de robótica'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00423', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio B', 'piso' => 'Planta baja', 'ubicacion' => 'Taller de robótica'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00425', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio B', 'piso' => 'Planta baja', 'ubicacion' => 'Pasillo'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00426', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio C', 'piso' => 'Nivel 1', 'ubicacion' => 'Escaleras'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00442', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio C', 'piso' => 'Planta baja', 'ubicacion' => 'Escaleras'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00443', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio C', 'piso' => 'Nivel 1', 'ubicacion' => 'Biblioteca'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00444', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio B', 'piso' => 'Nivel 1', 'ubicacion' => 'Pasillo'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00469', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio C', 'piso' => 'Planta baja', 'ubicacion' => 'Auditorio'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00470', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Cafetería y SUM', 'piso' => 'Nivel único', 'ubicacion' => 'Cocina'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00583', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio C', 'piso' => 'Nivel 1', 'ubicacion' => 'Biblioteca'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00680', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Cafetería y SUM', 'piso' => 'Nivel único', 'ubicacion' => 'SUM'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00703', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio E', 'piso' => 'Planta baja', 'ubicacion' => 'Auditorio'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00740', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Vigilancia', 'piso' => 'Nivel único', 'ubicacion' => 'Cuarto de vigilancia'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00769', 'tipo' => 'PQS', 'capacidad' => '1 kg', 'instalacion' => 'Almacén', 'piso' => 'Nivel único', 'ubicacion' => 'Almacén general'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00824', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Almacén', 'piso' => 'Nivel único', 'ubicacion' => 'Almacén general'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00825', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio B', 'piso' => 'Nivel 1', 'ubicacion' => 'Lab. Redes'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00826', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio C', 'piso' => 'Planta baja', 'ubicacion' => 'Pasillo'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00844', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio B', 'piso' => 'Nivel 1', 'ubicacion' => 'Pasillo'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00845', 'tipo' => 'PQS', 'capacidad' => '2 kg', 'instalacion' => 'Edificio A', 'piso' => 'Planta baja', 'ubicacion' => 'Oficina de cómputo'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00846', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Edificio B', 'piso' => 'Nivel 1', 'ubicacion' => 'Lab. Redes'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00900', 'tipo' => 'CO2', 'capacidad' => '4.5 kg', 'instalacion' => 'Parque vehicular', 'piso' => 'Nivel único', 'ubicacion' => 'Estacionamiento'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00902', 'tipo' => 'PQS', 'capacidad' => '1 kg', 'instalacion' => 'Edificio C', 'piso' => 'Planta baja', 'ubicacion' => 'Lab. Programación'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00906', 'tipo' => 'PQS', 'capacidad' => '2.5 kg', 'instalacion' => 'Edificio C', 'piso' => 'Planta baja', 'ubicacion' => 'Lab. Programación'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00957', 'tipo' => 'PQS', 'capacidad' => '2.5 kg', 'instalacion' => 'Edificio A', 'piso' => 'Nivel 1', 'ubicacion' => 'Lab. Dibujo'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-00963', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Cafetería y SUM', 'piso' => 'Nivel único', 'ubicacion' => 'SUM'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-01196', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Cafetería y SUM', 'piso' => 'Nivel único', 'ubicacion' => 'SUM'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-01240', 'tipo' => 'PQS', 'capacidad' => '2.5 kg', 'instalacion' => 'Parque vehicular', 'piso' => 'Nivel único', 'ubicacion' => 'Sprinter'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-01241', 'tipo' => 'PQS', 'capacidad' => '1 kg', 'instalacion' => 'Parque vehicular', 'piso' => 'Nivel único', 'ubicacion' => 'Estacionamiento'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-01242', 'tipo' => 'PQS', 'capacidad' => '9 kg', 'instalacion' => 'Almacén', 'piso' => 'Nivel único', 'ubicacion' => 'Almacén general'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-01334', 'tipo' => 'CO2', 'capacidad' => '4.5 kg', 'instalacion' => 'Edificio A', 'piso' => 'Nivel 1', 'ubicacion' => 'Lab. Dibujo'],
            ['etiqueta_inventario' => 'ITJMM-62007-5100-01335', 'tipo' => 'CO2', 'capacidad' => '2.2 kg', 'instalacion' => 'Edificio A', 'piso' => 'Planta baja', 'ubicacion' => 'Oficina de cómputo'],
        ];
    }
}
