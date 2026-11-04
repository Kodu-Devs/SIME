<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'name' por el rename de la columna users.nombre
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function estres(): static
    {      
        return $this->state(function (array $attributes) {
            // Consecutivo (no aleatorio) para no chocar con el correo único ni topar en 1000.
            static $numero = null;
            $numero ??= User::withTrashed()->where('email', 'like', 'estres-%')->count();
            $numero++;

            return [
                'name' => "ESTRES-Usuario {$numero}",
                'email' => "estres-{$numero}@sime.test",
                'email_verified_at' => now(),
            ];
        });
    }
}
