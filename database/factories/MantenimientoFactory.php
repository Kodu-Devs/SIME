<?php

namespace Database\Factories;

use App\Models\Mantenimiento;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Mantenimiento>
 */
class MantenimientoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
    'tipo' => $this->faker->randomElement(['revision', 'recarga', 'reemplazo']), 
    'descripcion' => $this->faker->sentence(),
    'fecha_programada' => $this->faker->dateTimeBetween('now', '+1 month'),
    'fecha_realizada' => null,
];
    }
}
