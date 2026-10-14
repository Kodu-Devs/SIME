<?php

namespace Database\Seeders;

use App\Models\Instalacion;
use App\Models\Piso;
use Illuminate\Database\Seeder;

class PisoSeeder extends Seeder
{
    public function run(): void
    {
        $instalacionesCache = Instalacion::all()->keyBy('nombre');

        if ($instalacionesCache->isEmpty()) {
            $this->command->warn('Saltando PisoSeeder: No hay instalaciones. Corre primero InstalacionSeeder.');
            return;
        }

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
            // Buscamos en la colección de memoria en vez de consultar la base de datos
            $instalacion = $instalacionesCache->get($piso['instalacion']);

            if (! $instalacion) {
                // Cambiamos la excepción que rompe todo por un simple aviso
                $this->command->warn("Se omite el piso: No existe la instalación '{$piso['instalacion']}'.");
                continue;
            }

            // firstOrCreate es perfecto aquí: si encuentra esta combinación no hace nada, si no, la crea.
            Piso::firstOrCreate([
                'instalacion_id' => $instalacion->id,
                'nombre'         => $piso['nombre'],
            ]);
        }
        
        $this->command->info('Pisos sembrados con éxito.');
    }
}