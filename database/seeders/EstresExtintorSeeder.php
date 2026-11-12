<?php

namespace Database\Seeders;

use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use Illuminate\Database\Seeder;

class EstresExtintorSeeder extends Seeder
{
    private const CANTIDAD = 5000;

    public function run(): void
    {
        if (TipoExtintor::count() === 0 || Ubicacion::count() === 0) {
            $this->command->warn('La base está vacía. No hay Tipos de Extintor ni Ubicaciones para asignar. Abortando EstresExtintorSeeder.');
            return;
        }

        $this->command->info('Generando ' . self::CANTIDAD . ' extintores de estrés...');

        $estados = ['vigente', 'porvencer', 'vencido', 'baja'];

        for ($i = 1; $i <= self::CANTIDAD; $i++) {
            $estadoSeleccionado = $estados[array_rand($estados)];

            Extintor::factory()
                ->{$estadoSeleccionado}()
                ->create([
                    'etiqueta_inventario' => 'ESTRES-' . str_pad($i, 5, '0', STR_PAD_LEFT),
                ]);
        }
    }
}
