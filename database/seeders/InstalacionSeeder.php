<?php

namespace Database\Seeders;

use App\Models\Instalacion;
use Illuminate\Database\Seeder;

class InstalacionSeeder extends Seeder
{
    
    public function run(): void
    {
        $instalaciones = [
            ['nombre' => 'Edificio A',                      'tipo' => 'Edificio'],
            ['nombre' => 'Edificio B',                      'tipo' => 'Edificio'],
            ['nombre' => 'Edificio C',                      'tipo' => 'Edificio'],
            ['nombre' => 'Edificio D',                      'tipo' => 'Edificio'],
            ['nombre' => 'Edificio E',                      'tipo' => 'Edificio'],
            ['nombre' => 'Cafetería y SUM',                 'tipo' => 'Edificio'],
            ['nombre' => 'Glorieta',                        'tipo' => 'Área exterior'],
            ['nombre' => 'Cancha',                          'tipo' => 'Área exterior'],
            ['nombre' => 'Estacionamiento de motocicletas', 'tipo' => 'Área exterior'],
            ['nombre' => 'Parque vehicular',                'tipo' => 'Área exterior'],
            ['nombre' => 'Vigilancia',                      'tipo' => 'Área exterior'],
            ['nombre' => 'Almacén',                         'tipo' => 'Área exterior'],
        ];

        foreach ($instalaciones as $instalacion) {
            Instalacion::updateOrCreate(
                ['nombre' => $instalacion['nombre']],
                ['tipo'   => $instalacion['tipo']]
            );
        }
    }
}