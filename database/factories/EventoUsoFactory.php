<?php

namespace Database\Factories;

use App\Models\EventoUso;
use App\Models\Extintor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Collection;

class EventoUsoFactory extends Factory
{
    protected $model = EventoUso::class;

    protected static ?array $userIds = null;

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

    public function deCapacitacion(Collection $capacitaciones): static
    {
        return $this->state(function () use ($capacitaciones) {
            $capacitacion = $capacitaciones->random();

            return [
                'capacitacion_id' => $capacitacion->id,
                'tipo_motivo' => 'Capacitación',
                'motivo' => 'ESTRES-'.fake()->randomElement(self::MOTIVOS['Capacitación']),
                'fecha' => $capacitacion->fecha_hora->copy()->addMinutes(fake()->numberBetween(10, 180)),
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
