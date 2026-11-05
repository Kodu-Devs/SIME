<?php

namespace Database\Factories;

use App\Models\Capacitacion;
use App\Models\Ubicacion;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Capacitacion>
 */
class CapacitacionFactory extends Factory
{
    protected $model = Capacitacion::class;

    /** @var array<int>|null Ubicaciones existentes, cargadas una sola vez (así no hay una consulta por fila). */
    protected static ?array $ubicacionIds = null;

    private const TEMAS = [
        'Uso y manejo de extintores',
        'Brigada de primeros auxilios',
        'Simulacro de evacuación',
        'Prevención de incendios',
        'Actualización de brigadas',
        'Capacitación para nuevo personal',
        'Combate de conatos de incendio',
        'Rutas de evacuación y puntos de reunión',
        'Revisión mensual de extintores',
        'Seguridad en laboratorios y talleres',
    ];

    public static function reiniciarCache(): void
    {
        static::$ubicacionIds = null;
    }

    public function definition(): array
    {
        return [
            'nombre' => 'ESTRES-' . fake()->randomElement(self::TEMAS) . ' #' . fake()->numerify('####'),
            'fecha_hora' => $this->fecha('-18 months', '-1 day'),
            'ubicacion_id' => $this->ubicacionId(),
        ];
    }

    /** Ya ocurrió (entre hace 18 meses y ayer). */
    public function pasada(): static
    {
        return $this->state(fn () => ['fecha_hora' => $this->fecha('-18 months', '-1 day')]);
    }

    /** Todavía no ocurre (entre mañana y dentro de 6 meses). */
    public function proxima(): static
    {
        return $this->state(fn () => ['fecha_hora' => $this->fecha('+1 day', '+6 months')]);
    }

    /** Baja lógica (deleted_at lleno). */
    public function eliminada(): static
    {
        return $this->state(fn () => [
            'deleted_at' => fake()->dateTimeBetween('-3 months', 'now'),
        ]);
    }

    private function fecha(string $desde, string $hasta): Carbon
    {
        return Carbon::instance(fake()->dateTimeBetween($desde, $hasta))
            ->setTime(fake()->numberBetween(8, 17), fake()->randomElement([0, 15, 30, 45]), 0);
    }

    private function ubicacionId(): ?int
    {
        static::$ubicacionIds ??= Ubicacion::pluck('id')->all();

        return static::$ubicacionIds ? fake()->randomElement(static::$ubicacionIds) : null;
    }
}