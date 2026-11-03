<?php

namespace Database\Factories;

use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExtintorFactory extends Factory
{
    protected $model = Extintor::class;

    public function definition(): array
    {
        $tipo = TipoExtintor::inRandomOrder()->first();
        $ubicacion = Ubicacion::inRandomOrder()->first();

        // Validar la unidad para asignar la capacidad correcta (Kg o L)
        $esLitros = $tipo && (stripos($tipo->unidad, 'l') !== false || stripos($tipo->unidad, 'litro') !== false);
        $capacidad = $this->faker->randomElement(
            $esLitros ? Extintor::CAPACIDADES_L : Extintor::CAPACIDADES_KG
        );

        return [
            // El seeder sobrescribirá esto para mantener la secuencia exacta ESTRES-0000X
            'etiqueta_inventario' => 'ESTRES-' . $this->faker->unique()->numerify('#####'),
            'tipoextintor_id' => $tipo?->id,
            'ubicacion_id' => $ubicacion?->id,
            'capacidad' => $capacidad,
            'estatus' => $this->faker->randomElement(['Disponible', 'Medio uso', 'Vacío', 'Fuera de servicio']),
        ];
    }

    public function vigente(): static
    {
        return $this->state(function (array $attributes) {
            $objetivo = $this->diaSeguro(today()->addDays($this->faker->numberBetween(8, 24)), false);
            $instalacion = $objetivo->copy()->subMonthsNoOverflow($this->faker->numberBetween(3, 10));

            return [
                'fecha_instalacion' => $instalacion,
                'fecha_vencimiento' => Extintor::calcularVencimiento($instalacion),
            ];
        });
    }

    public function porvencer(): static
    {
        return $this->state(function (array $attributes) {
            // Utiliza la configuración de días por vencer del sistema o 7 por defecto
            $dias = config('sime.dias_por_vencer', 7);
            $objetivo = $this->diaSeguro(today()->addDays($this->faker->numberBetween(1, $dias)), false);
            $instalacion = $objetivo->copy()->subMonthsNoOverflow($this->faker->numberBetween(3, 10));

            return [
                'fecha_instalacion' => $instalacion,
                'fecha_vencimiento' => Extintor::calcularVencimiento($instalacion),
            ];
        });
    }

    public function vencido(): static
    {
        return $this->state(function (array $attributes) {
            $objetivo = $this->diaSeguro(today()->subDays($this->faker->numberBetween(3, 20)), true);
            $instalacion = $objetivo->copy()->subMonthsNoOverflow($this->faker->numberBetween(3, 10));

            return [
                'fecha_instalacion' => $instalacion,
                'fecha_vencimiento' => Extintor::calcularVencimiento($instalacion)->subMonthNoOverflow(),
                'estatus' => $this->faker->randomElement(['Medio uso', 'Vacío', 'Fuera de servicio']),
            ];
        });
    }

    public function baja(): static
    {
        return $this->state(function (array $attributes) {
            $vencimiento = today()->subDays($this->faker->numberBetween(1, 180));
            return [
                'fecha_instalacion' => $vencimiento->copy()->subYears($this->faker->numberBetween(1, 4)),
                'fecha_vencimiento' => $vencimiento,
                'estatus' => 'Baja',
            ];
        });
    }

    private function diaSeguro(Carbon $fecha, bool $haciaAtras): Carbon
    {
        if ($fecha->day <= 28) {
            return $fecha->copy();
        }

        return $haciaAtras
            ? $fecha->copy()->day(28)
            : $fecha->copy()->addMonthsNoOverflow(1)->startOfMonth();
    }
}
