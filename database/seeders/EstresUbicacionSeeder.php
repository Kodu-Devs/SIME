<?php

namespace Database\Seeders;

use App\Models\Instalacion;
use App\Models\Piso;
use App\Models\Ubicacion;
use Database\Factories\InstalacionFactory;
use Database\Factories\UbicacionFactory;
use Illuminate\Database\Seeder;

class EstresUbicacionSeeder extends Seeder
{
    // Volumen configurable: 50 instalaciones x 3 pisos x 10 ubicaciones = 1,500 registros
    private const CANTIDAD = 50;
    private const PISOS_POR_EDIFICIO = 3;
    private const UBICACIONES_POR_PISO = 10;

    public function run(): void
    {
        $tiposInstalacion = InstalacionFactory::TIPOS;
        $tiposArea = UbicacionFactory::TIPOS_AREA;

        for ($i = 1; $i <= self::CANTIDAD; $i++) {
            $tipoInst = $tiposInstalacion[array_rand($tiposInstalacion)];

            $instalacion = Instalacion::factory()->create([
                'nombre' => "ESTRES-Edificio {$i}",
                'tipo'   => $tipoInst,
            ]);

            // Si es Área exterior se crea 1 solo nivel ('Nivel único'), si es Edificio se crean varios pisos
            $numPisos = $tipoInst === 'Área exterior' ? 1 : self::PISOS_POR_EDIFICIO;

            for ($p = 1; $p <= $numPisos; $p++) {
                $nombrePiso = $tipoInst === 'Área exterior' 
                    ? 'Nivel único' 
                    : ($p === 1 ? 'Planta baja' : 'Nivel ' . $p);

                $piso = Piso::factory()->create([
                    'instalacion_id' => $instalacion->getKey(),
                    'nombre'         => $nombrePiso,
                ]);

                Ubicacion::factory()
                    ->count(self::UBICACIONES_POR_PISO)
                    ->create([
                        'piso_id'   => $piso->getKey(),
                        'nombre'    => "ESTRES-Edificio {$i} - Piso {$p} - Zona " . fake()->unique()->numerify('###'),
                        'tipo_area' => $tiposArea[array_rand($tiposArea)],
                    ]);
            }
        }

        $this->command->info('EstresUbicacionSeeder ejecutado con éxito.');
    }
}