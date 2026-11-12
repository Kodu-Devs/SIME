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
    protected static ?array $userIds = null;

    /** @var array<int, string>|null */
    protected static ?array $fechasExtintores = null;

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
        static::$fechasExtintores = null;
        static::$userIds = null;
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        if (static::$fechasExtintores === null) {
            static::$fechasExtintores = Extintor::pluck('fecha_instalacion', 'id')->toArray();
        }

        $ids = array_keys(static::$fechasExtintores);
        $extintorId = ! empty($ids) ? fake()->randomElement($ids) : Extintor::factory()->create()->id;

        $tipoMotivo = fake()->randomElement(
            array_values(array_diff(EventoUso::TIPOS_MOTIVO, ['Capacitación']))
        );

        $fechaStr = static::$fechasExtintores[$extintorId] ?? null;
        $instalacion = $fechaStr ? Carbon::parse($fechaStr) : now()->subYear();

        if ($instalacion->isFuture() || $instalacion->diffInMinutes(now()) < 60) {
            $instalacion = now()->subYear();
        }

        return [
            'extintor_id' => $extintorId,
            'user_id' => $this->userId(),
            'fecha' => Carbon::instance(fake()->dateTimeBetween($instalacion, '-1 hour')),
            'tipo_motivo' => $tipoMotivo,
            'motivo' => 'ESTRES-'.fake()->randomElement(self::MOTIVOS[$tipoMotivo] ?? ['Evento de uso']),
            'capacitacion_id' => null,
            'tipo_descarga' => $this->descarga($tipoMotivo),
        ];
    }

    /**
     * Evento que viene de una capacitación.
     *
     * @param  Collection<int, Capacitacion>  $capacitaciones
     */
    public function deCapacitacion(Collection $capacitaciones): static
    {
        return $this->state(function (array $attributes) use ($capacitaciones) {
            $extintorId = $attributes['extintor_id'];
            $fechaStr = static::$fechasExtintores[$extintorId] ?? null;
            $instalacion = $fechaStr ? Carbon::parse($fechaStr) : now()->subYear();

            // Filtrar para usar solo capacitaciones posteriores a la instalación
            $validas = $capacitaciones->filter(fn ($cap) => $cap->fecha_hora->isAfter($instalacion));
            $capacitacion = $validas->isNotEmpty() ? $validas->random() : $capacitaciones->random();

            $fecha = $capacitacion->fecha_hora->copy()->addMinutes(fake()->numberBetween(10, 180));

            // Garantizar la coherencia por si caemos en el fallback
            if ($fecha->isBefore($instalacion)) {
                $fecha = $instalacion->copy()->addDays(1);
            }

            return [
                'capacitacion_id' => $capacitacion->id,
                'tipo_motivo' => 'Capacitación',
                'motivo' => 'ESTRES-'.fake()->randomElement(self::MOTIVOS['Capacitación']),
                'fecha' => $fecha,
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

    private function userId(): ?int
    {
        static::$userIds ??= User::inRandomOrder()->pluck('id')->all();

        return static::$userIds ? fake()->randomElement(static::$userIds) : null;
    }
}
