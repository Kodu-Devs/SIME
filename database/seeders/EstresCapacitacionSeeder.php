<?php

namespace Database\Seeders;

use App\Models\Capacitacion;
use App\Models\Ubicacion;
use Database\Factories\CapacitacionFactory;
use Illuminate\Database\Seeder;

class EstresCapacitacionSeeder extends Seeder
{
    // Cuántas capacitaciones ESTRES- se generan (configurable).
    private const CANTIDAD = 1500;

    public function run(): void
    {
        if (Ubicacion::count() === 0) {
            $this->command->warn('Saltando EstresCapacitacionSeeder: No hay ubicaciones. Corre primero migrate:fresh --seed.');

            return;
        }

        CapacitacionFactory::reiniciarCache();

        // 10 % con baja lógica, 30 % próximas y el resto ya pasadas.
        $eliminadas = intdiv(self::CANTIDAD, 10);
        $proximas = intdiv(self::CANTIDAD * 3, 10);
        $pasadas = self::CANTIDAD - $eliminadas - $proximas;

        Capacitacion::factory()->count($pasadas)->pasada()->create();
        Capacitacion::factory()->count($proximas)->proxima()->create();
        Capacitacion::factory()->count($eliminadas)->pasada()->eliminada()->create();

        $total = Capacitacion::withTrashed()->where('nombre', 'like', 'ESTRES-%')->count();
        $this->command->info("Capacitaciones ESTRES- en la base: {$total}.");
    }
}