<?php

namespace Database\Factories;

use App\Models\Instalacion;
use Illuminate\Database\Eloquent\Factories\Factory;

class InstalacionFactory extends Factory
{
    protected $model = Instalacion::class;

    public const TIPOS = [
        'Edificio',
        'Área exterior',
    ];

    public function definition(): array
    {
        static $numero = 1;

        return [
            'nombre' => 'ESTRES-Edificio ' . $numero++,
            'tipo'   => fake()->randomElement(self::TIPOS),
        ];
    }
}