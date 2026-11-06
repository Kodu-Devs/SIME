<?php

namespace Database\Factories;

use App\Models\Extintor;
use App\Models\Mantenimiento;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class MantenimientoFactory extends Factory
{
    protected $model = Mantenimiento::class;

    public function definition(): array
    {
        return [
            'extintor_id' => fn () => Extintor::inRandomOrder()->value('id') ?? Extintor::factory(),
            'tipo' => $this->faker->randomElement(['Revisión', 'Relleno de contenido', 'Otra']),
            'descripcion' => 'ESTRES-Mantenimiento ' . $this->faker->sentence(3),
            'fecha_programada' => function (array $attributes) {
                $extintor = Extintor::find($attributes['extintor_id']);
                if (!$extintor || !$extintor->fecha_instalacion) {
                    return $this->faker->dateTimeBetween('-1 year', '+2 months');
                }
                
                $instalacion = Carbon::parse($extintor->fecha_instalacion);
                return $this->faker->dateTimeBetween($instalacion, '+2 months');
            },
            'fecha_realizada' => null,
            'deleted_at' => null,
        ];
    }

    public function pendiente(): static
    {
        return $this->state(fn (array $attributes) => [
            'fecha_realizada' => null,
        ]);
    }

    public function realizado(): static
    {
        return $this->state(function (array $attributes) {
            $extintor = Extintor::find($attributes['extintor_id']);
            $limiteInferior = ($extintor && $extintor->fecha_instalacion) 
                ? Carbon::parse($extintor->fecha_instalacion) 
                : '-1 year';

            $programada = $this->faker->dateTimeBetween($limiteInferior, 'now');
            
            return [
                'fecha_programada' => $programada,
                'fecha_realizada' => $this->faker->dateTimeBetween($programada, 'now'),
            ];
        });
    }

    public function atrasado(): static
    {
        return $this->state(function (array $attributes) {
            $extintor = Extintor::find($attributes['extintor_id']);
            $limiteInferior = ($extintor && $extintor->fecha_instalacion) 
                ? Carbon::parse($extintor->fecha_instalacion) 
                : '-1 year';

            return [
                'fecha_programada' => $this->faker->dateTimeBetween($limiteInferior, '-1 days'),
                'fecha_realizada' => null,
            ];
        });
    }

    public function conBajaLogica(): static
    {
        return $this->state(fn (array $attributes) => [
            'deleted_at' => now(),
        ]);
    }
}