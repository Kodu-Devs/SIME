<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class EstresUserSeeder extends Seeder
{
    private const CANTIDAD = 100; // Puedes ajustar el volumen alto deseado

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Genera usuarios en masa utilizando el state de estrés
        User::factory()->count(self::CANTIDAD)->estres()->create();

        $this->command->info(self::CANTIDAD . ' usuarios de estrés creados exitosamente.');
    }
}