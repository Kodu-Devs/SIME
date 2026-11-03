<?php

namespace Database\Seeders;

use App\Models\Extintor;
use App\Models\Mantenimiento;
use Illuminate\Database\Seeder;

class EstresMantenimientoSeeder extends Seeder
{
    private const CANTIDAD = 300; // Volumen alto para la prueba de estrés

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Regla general: Si la tabla de extintores está vacía, avisa y detiene el seeder de forma segura
        if (Extintor::count() === 0) {
            $this->command->warn('EstresMantenimientoSeeder omitido: No hay extintores registrados en la base de datos.');
            return;
        }

        // Generar una mezcla variada de los diferentes estados requeridos
        Mantenimiento::factory()->count(intval(self::CANTIDAD * 0.3))->pendiente()->create();
        Mantenimiento::factory()->count(intval(self::CANTIDAD * 0.4))->realizado()->create();
        Mantenimiento::factory()->count(intval(self::CANTIDAD * 0.2))->atrasado()->create();
        Mantenimiento::factory()->count(intval(self::CANTIDAD * 0.1))->conBajaLogica()->create();

        $this->command->info(self::CANTIDAD . ' registros de mantenimientos de estrés creados con éxito.');
    }
}