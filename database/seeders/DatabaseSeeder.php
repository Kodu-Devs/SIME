<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Tablas base / Catálogos independientes
            AdminSeeder::class,
            TipoExtintorSeeder::class,
            InstalacionSeeder::class,
            
            // 2. Tablas intermedias en cascada
            PisoSeeder::class,
            UbicacionSeeder::class,
            
            // 3. Extintores (depende de ubicación y tipo)
            ExtintorSeeder::class,
            
            // 4. Tablas transaccionales y operativas (dependen de usuarios y extintores)
            CapacitacionSeeder::class,
            EventoUsoSeeder::class,
            MantenimientoSeeder::class,
            AlertaSeeder::class,
        ]);
    }
}