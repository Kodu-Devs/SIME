<?php

namespace Database\Factories;

use App\Models\Instalacion;
use App\Models\Piso;
use Illuminate\Database\Eloquent\Factories\Factory;

class PisoFactory extends Factory
{
    protected $model = Piso::class;

    public function definition(): array
    {
        return [
            'instalacion_id' => Instalacion::factory(),
            'nombre'         => fake()->randomElement([
                'Planta baja', 'Nivel 1', 'Nivel 2', 'Nivel único'
            ]),
        ];
    }
}