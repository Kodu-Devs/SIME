<?php

namespace Database\Factories;

use App\Models\Piso;
use App\Models\Ubicacion;
use Illuminate\Database\Eloquent\Factories\Factory;

class UbicacionFactory extends Factory
{
    protected $model = Ubicacion::class;

    // Tipos de área oficiales extraídos de tu UbicacionSeeder
    public const TIPOS_AREA = [
        'Escaleras',
        'Oficina',
        'Laboratorio',
        'Pasillo',
        'Taller',
        'Auditorio',
        'Biblioteca',
        'Cocina',
        'Sala',
        'Estacionamiento',
        'Vehículo',
        'Vigilancia',
        'Almacén',
    ];

    public function definition(): array
    {
        return [
            'piso_id'   => Piso::factory(),
            'nombre'    => 'ESTRES-Zona ' . fake()->unique()->numerify('####'),
            'tipo_area' => fake()->randomElement(self::TIPOS_AREA),
            // Formato de arreglo JSON en 'posicion' para que el mapa lo pinte
            'posicion'  => [
                'x' => fake()->randomFloat(2, 5, 95),
                'y' => fake()->randomFloat(2, 5, 95),
            ],
        ];
    }
}