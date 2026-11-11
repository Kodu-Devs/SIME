<?php

namespace Database\Factories;

use App\Models\Extintor;
use App\Models\Mantenimiento;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class MantenimientoFactory extends Factory
{
    protected $model = Mantenimiento::class;

    protected static ?array $fechasExtintores = null;

    public static function reiniciarCache(): void
    {
        static::$fechasExtintores = null;
    }

    private function getFechas(): array
    {
        if (static::$fechasExtintores === null) {
            static::$fechasExtintores = Extintor::pluck('fecha_instalacion', 'id')->toArray();
        }

        return static::$fechasExtintores;
    }

    public function definition(): array
    {
        $fechas = $this->getFechas();
        $ids = array_keys($fechas);
        $extintorId = ! empty($ids) ? $this->faker->randomElement($ids) : Extintor::factory()->create()->id;

        $fechaStr = $fechas[$extintorId] ?? null;
        $instalacion = $fechaStr ? Carbon::parse($fechaStr) : now()->subYear();

        if ($instalacion->isFuture() || $instalacion->diffInMinutes(now()) < 60) {
            $instalacion = now()->subYear();
        }

        return [
            'extintor_id' => $extintorId,
            'tipo' => $this->faker->randomElement(['Revisión', 'Relleno de contenido', 'Otra']),
            'descripcion' => 'ESTRES-Mantenimiento '.$this->faker->sentence(3),
            'fecha_programada' => $this->faker->dateTimeBetween($instalacion, '+2 months'),
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
            $fechas = $this->getFechas();
            $fechaStr = $fechas[$attributes['extintor_id']] ?? null;
            $instalacion = $fechaStr ? Carbon::parse($fechaStr) : now()->subYear();

            if ($instalacion->isFuture() || $instalacion->diffInMinutes(now()) < 60) {
                $instalacion = now()->subYear();
            }

            $programada = Carbon::instance($this->faker->dateTimeBetween($instalacion, 'now'));

            // Garantizar margen entre programada y hoy
            if ($programada->diffInMinutes(now()) < 5) {
                $programada = now()->subMinutes(10);
            }

            return [
                'fecha_programada' => $programada,
                'fecha_realizada' => $this->faker->dateTimeBetween($programada, 'now'),
            ];
        });
    }

    public function atrasado(): static
    {
        return $this->state(function (array $attributes) {
            $fechas = $this->getFechas();
            $fechaStr = $fechas[$attributes['extintor_id']] ?? null;
            $instalacion = $fechaStr ? Carbon::parse($fechaStr) : now()->subYear();

            if ($instalacion->isFuture() || $instalacion->diffInMinutes(now()->subDay()) < 60) {
                $instalacion = now()->subYear();
            }

            return [
                'fecha_programada' => $this->faker->dateTimeBetween($instalacion, '-1 days'),
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
