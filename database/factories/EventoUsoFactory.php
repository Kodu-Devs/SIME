<?php

namespace Database\Factories;

use App\Models\Capacitacion;
use App\Models\EventoUso;
use App\Models\Extintor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Collection;

/**
 * @extends Factory<EventoUso>
 */
class EventoUsoFactory extends Factory
{
    protected $model = EventoUso::class;

    /** @var array<int>|null */
    protected static ?array $extintorIds = null;

    /** @var array<int>|null */
    protected static ?array $userIds = null;

    private const MOTIVOS = [
        'Conato' => [
            'Conato de incendio en cocina',
            'Conato de incendio por corto circuito',
            'Conato en taller',
            'Humo detectado en laboratorio',
        ],
        'Simulacro' => [
            'Simulacro de evacuación',
            'Simulacro de incendio en edificio',
            'Simulacro con brigada',
        ],
        'Capacitación' => [
            'Práctica de capacitación',
            'Capacitación de brigada',
            'Demostración de uso de extintor',
        ],
        'Otro' => [
            'Descarga accidental',
            'Uso en emergencia real',
            'Prueba de funcionamiento',
        ],
    ];

    public static function reiniciarCache(): void
    {
        static::$extintorIds = null;
        static::$userIds = null;
    }

    public function definition(): array
    {
        // Sin Capacitación: ese tipo solo va con capacitacion_id (ver deCapacitacion()).
        $tipoMotivo = fake()->randomElement(
            array_values(array_diff(EventoUso::TIPOS_MOTIVO, ['Capacitación']))
        );

        return [
            'extintor_id' => $this->extintorId(),
            'user_id' => $this->userId(),
            'fecha' => Carbon::instance(fake()->dateTimeBetween('-12 months', '-1 hour')),
            'tipo_motivo' => $tipoMotivo,
            'motivo' => 'ESTRES-' . fake()->randomElement(self::MOTIVOS[$tipoMotivo] ?? ['Evento de uso']),
            'capacitacion_id' => null,
            'tipo_descarga' => $this->descarga($tipoMotivo),
        ];
    }

    /**
     * Evento que viene de una capacitación: queda ligado a ella, su tipo_motivo es
     * Capacitación y la fecha cae el mismo día que la capacitación.
     * Las capacitaciones deben ser pasadas (el seeder ya las filtra).
     *
     * @param  Collection<int, Capacitacion>  $capacitaciones
     */
    public function deCapacitacion(Collection $capacitaciones): static
    {
        return $this->state(function () use ($capacitaciones) {
            $capacitacion = $capacitaciones->random();

            return [
                'capacitacion_id' => $capacitacion->id,
                'tipo_motivo' => 'Capacitación',
                'motivo' => 'ESTRES-' . fake()->randomElement(self::MOTIVOS['Capacitación']),
                'fecha' => $capacitacion->fecha_hora->copy()->addMinutes(fake()->numberBetween(10, 180)),
                // En las prácticas casi siempre es descarga parcial.
                'tipo_descarga' => fake()->boolean(20) ? 'total' : 'parcial',
            ];
        });
    }

    private function descarga(string $tipoMotivo): string
    {
        $probabilidadTotal = match ($tipoMotivo) {
            'Conato' => 45,
            'Simulacro' => 15,
            default => 50,
        };

        return fake()->boolean($probabilidadTotal) ? 'total' : 'parcial';
    }

    private function extintorId(): ?int
    {
        static::$extintorIds ??= Extintor::inRandomOrder()->pluck('id')->all();

        return static::$extintorIds ? fake()->randomElement(static::$extintorIds) : null;
    }

    private function userId(): ?int
    {
        static::$userIds ??= User::inRandomOrder()->pluck('id')->all();

        return static::$userIds ? fake()->randomElement(static::$userIds) : null;
    }
}
