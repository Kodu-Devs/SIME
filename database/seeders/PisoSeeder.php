<?php

namespace Database\Seeders;

use App\Models\Instalacion;
use App\Models\Piso;
use Illuminate\Database\Seeder;
use RuntimeException;

class PisoSeeder extends Seeder
{
    
    public function run(): void
    {
        $pisos = [
            ['instalacion' => 'Edificio A',                      'nombre' => 'Planta baja'],
            ['instalacion' => 'Edificio A',                      'nombre' => 'Nivel 1'],
            ['instalacion' => 'Edificio B',                      'nombre' => 'Planta baja'],
            ['instalacion' => 'Edificio B',                      'nombre' => 'Nivel 1'],
            ['instalacion' => 'Edificio C',                      'nombre' => 'Planta baja'],
            ['instalacion' => 'Edificio C',                      'nombre' => 'Nivel 1'],
            ['instalacion' => 'Edificio D',                      'nombre' => 'Planta baja'],
            ['instalacion' => 'Edificio D',                      'nombre' => 'Nivel 1'],
            ['instalacion' => 'Edificio E',                      'nombre' => 'Planta baja'],
            ['instalacion' => 'Edificio E',                      'nombre' => 'Nivel 1'],
            ['instalacion' => 'Edificio E',                      'nombre' => 'Nivel 2'],
            ['instalacion' => 'Edificio E',                      'nombre' => 'Nivel 3'],
            ['instalacion' => 'Cafetería y SUM',                 'nombre' => 'Nivel único'],
            ['instalacion' => 'Glorieta',                        'nombre' => 'Nivel único'],
            ['instalacion' => 'Cancha',                          'nombre' => 'Nivel único'],
            ['instalacion' => 'Estacionamiento de motocicletas', 'nombre' => 'Nivel único'],
            ['instalacion' => 'Parque vehicular',                'nombre' => 'Nivel único'],
            ['instalacion' => 'Vigilancia',                      'nombre' => 'Nivel único'],
            ['instalacion' => 'Almacén',                         'nombre' => 'Nivel único'],
        ];

        foreach ($pisos as $piso) {
            $instalacion = Instalacion::where('nombre', $piso['instalacion'])->first();

            if (! $instalacion) {
                throw new RuntimeException(
                    "No existe la instalación '{$piso['instalacion']}'. Corre primero InstalacionSeeder."
                );
            }

            Piso::firstOrCreate([
                'instalacion_id' => $instalacion->id,
                'nombre'         => $piso['nombre'],
            ]);
        }
    }
}