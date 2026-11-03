<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Orquestador de los datos de estrés. Solo corre en local.
 *
 * Uso: php artisan db:seed --class=EstresSeeder
 * Limpiar: php artisan migrate:fresh --seed
 */
class EstresSeeder extends Seeder
{
    /**
     * Seeders de cada parte, en el orden en que dependen unos de otros.
     *
     * @var array<string, class-string>
     */
    private const SEEDERS = [
        'Ubicación' => 'Database\\Seeders\\EstresUbicacionSeeder',
        'Usuarios' => 'Database\\Seeders\\EstresUserSeeder',
        'Extintores' => 'Database\\Seeders\\EstresExtintorSeeder',
        'Mantenimientos' => 'Database\\Seeders\\EstresMantenimientoSeeder',
        'Capacitaciones' => 'Database\\Seeders\\EstresCapacitacionSeeder',
        'Eventos' => 'Database\\Seeders\\EstresEventoUsoSeeder',
        'Alertas' => 'Database\\Seeders\\EstresAlertaSeeder',
    ];

    public function run(): void
    {
        if (! app()->environment('local')) {
            $this->command->error('EstresSeeder solo corre en el ambiente local. No se hizo nada.');

            return;
        }

        foreach (self::SEEDERS as $parte => $clase) {
            // Si la parte de alguien aún no está en esta rama, se avisa y se sigue.
            if (! class_exists($clase)) {
                $this->command->warn("{$parte}: {$clase} no existe todavía, se omite.");

                continue;
            }

            $this->command->info("Corriendo {$parte}...");
            $this->call($clase);
        }

        $this->resumen();
    }

    /**
     * Imprime cuántos registros ESTRES- quedaron por tabla.
     */
    private function resumen(): void
    {
        $filas = [
            ['instalaciones', DB::table('instalaciones')->where('nombre', 'like', 'ESTRES-%')->count()],
            ['users', DB::table('users')->where('name', 'like', 'ESTRES-%')->orWhere('email', 'like', 'estres-%')->count()],
            ['extintores', DB::table('extintores')->where('etiqueta_inventario', 'like', 'ESTRES-%')->count()],
            ['mantenimientos', DB::table('mantenimientos')->where('descripcion', 'like', 'ESTRES-%')->count()],
            ['capacitaciones', DB::table('capacitaciones')->where('nombre', 'like', 'ESTRES-%')->count()],
            ['evento_uso', DB::table('evento_uso')->where('motivo', 'like', 'ESTRES-%')->count()],
            ['alertas', DB::table('alertas')->where('mensaje', 'like', 'ESTRES-%')->count()],
        ];

        $this->command->newLine();
        $this->command->info('Registros ESTRES- por tabla:');
        $this->command->table(['Tabla', 'Registros'], $filas);
    }
}
