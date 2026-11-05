<?php

namespace Database\Factories;

use App\Models\Extintor;
use App\Models\Mantenimiento;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Mantenimiento>
 */
class MantenimientoFactory extends Factory
{
    protected $model = Mantenimiento::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'extintor_id' => Extintor::inRandomOrder()->value('id'),
            'tipo' => $this->faker->randomElement(['Revisión', 'Relleno de contenido', 'Otra']),
            // Marca obligatoria ESTRES- en la descripción según las instrucciones
            'descripcion' => 'ESTRES-Mantenimiento ' . $this->faker->sentence(3),
            'fecha_programada' => $this->faker->dateTimeBetween('-2 months', '+2 months'),
            'fecha_realizada' => null,
            'deleted_at' => null,
        ];
    }

    /**
     * State: Mantenimiento pendiente (fecha_realizada en null)
     */
    public function pendiente(): static
    {
        return $this->state(fn (array $attributes) => [
            'fecha_realizada' => null,
        ]);
    }

    /**
     * State: Mantenimiento realizado (fecha_realizada >= programada)
     */
    public function realizado(): static
    {
        return $this->state(function (array $attributes) {
            $programada = $this->faker->dateTimeBetween('-3 months', 'now');
            return [
                'fecha_programada' => $programada,
                'fecha_realizada' => $this->faker->dateTimeBetween($programada, 'now'),
            ];
        });
    }

    /**
     * State: Mantenimiento atrasado (programado en el pasado y sin realizar)
     */
    public function atrasado(): static
    {
        return $this->state(fn (array $attributes) => [
            'fecha_programada' => $this->faker->dateTimeBetween('-3 months', '-1 days'),
            'fecha_realizada' => null,
        ]);
    }

    /**
     * State: Mantenimiento con baja lógica
     */
    public function conBajaLogica(): static
    {
        return $this->state(fn (array $attributes) => [
            'deleted_at' => now(),
        ]);
    }
}