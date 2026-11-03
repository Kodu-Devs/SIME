<?php

namespace Database\Factories;

use App\Models\Alerta;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Alerta>
 */
class AlertaFactory extends Factory
{
    public const TIPOS = ['Urgente', 'Próximo', 'Informativo'];

    /**
     * Estado base: no consulta la base de datos. El origen (extintor,
     * mantenimiento o capacitación) y el usuario los asigna cada state
     * o el seeder, para que la alerta nunca apunte a un origen incoherente.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'extintor_id' => null,
            'mantenimiento_id' => null,
            'capacitacion_id' => null,
            'tipo' => fake()->randomElement(self::TIPOS),
            'categoria' => fake()->randomElement(Alerta::CATEGORIAS),
            'mensaje' => 'ESTRES-'.fake()->sentence(6),
            'fecha_generada' => fake()->dateTimeBetween('-60 days', 'now'),
            'leida' => fake()->boolean(40),
        ];
    }

    /**
     * Alerta de extintor vencido: siempre apunta a un extintor.
     */
    public function vencido(int $extintorId, string $etiqueta = ''): static
    {
        return $this->state(fn (): array => [
            'extintor_id' => $extintorId,
            'mantenimiento_id' => null,
            'capacitacion_id' => null,
            'categoria' => 'vencido',
            'tipo' => 'Urgente',
            'mensaje' => "ESTRES-{$etiqueta} Extintor vencido",
        ]);
    }

    /**
     * Alerta de extintor por vencer: siempre apunta a un extintor.
     */
    public function porVencer(int $extintorId, string $etiqueta = ''): static
    {
        return $this->state(fn (): array => [
            'extintor_id' => $extintorId,
            'mantenimiento_id' => null,
            'capacitacion_id' => null,
            'categoria' => 'por_vencer',
            'tipo' => 'Próximo',
            'mensaje' => "ESTRES-{$etiqueta} Extintor por vencer",
        ]);
    }

    /**
     * Alerta por estatus del extintor (vacío o fuera de servicio).
     */
    public function estatus(int $extintorId, string $etiqueta = ''): static
    {
        return $this->state(fn (): array => [
            'extintor_id' => $extintorId,
            'mantenimiento_id' => null,
            'capacitacion_id' => null,
            'categoria' => 'estatus',
            'tipo' => fake()->randomElement(['Urgente', 'Próximo']),
            'mensaje' => "ESTRES-{$etiqueta} Extintor vacío o fuera de servicio",
        ]);
    }

    /**
     * Alerta de mantenimiento: apunta solo a un mantenimiento.
     */
    public function mantenimiento(int $mantenimientoId): static
    {
        return $this->state(fn (): array => [
            'extintor_id' => null,
            'mantenimiento_id' => $mantenimientoId,
            'capacitacion_id' => null,
            'categoria' => 'mantenimiento',
            'tipo' => fake()->randomElement(['Urgente', 'Próximo']),
            'mensaje' => 'ESTRES-Mantenimiento '.fake()->randomElement(['atrasado', 'próximo']),
        ]);
    }

    /**
     * Alerta de capacitación: apunta solo a una capacitación.
     */
    public function capacitacion(int $capacitacionId): static
    {
        return $this->state(fn (): array => [
            'extintor_id' => null,
            'mantenimiento_id' => null,
            'capacitacion_id' => $capacitacionId,
            'categoria' => 'capacitacion',
            'tipo' => fake()->randomElement(['Informativo', 'Próximo']),
            'mensaje' => 'ESTRES-Capacitación próxima',
        ]);
    }

    /**
     * Alerta ya leída.
     */
    public function leida(): static
    {
        return $this->state(fn (): array => ['leida' => true]);
    }

    /**
     * Alerta sin leer.
     */
    public function noLeida(): static
    {
        return $this->state(fn (): array => ['leida' => false]);
    }
}
