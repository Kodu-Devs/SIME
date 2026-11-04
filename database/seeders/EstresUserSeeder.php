<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class EstresUserSeeder extends Seeder
{
    private const CANTIDAD = 1000; // Puedes ajustar el volumen alto deseado

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Consecutivo que sigue después de los estres- que ya existan.
        $inicio = User::withTrashed()->where('email', 'like', 'estres-%')->count();

        User::factory()
            ->count(self::CANTIDAD)
            ->estres()
            ->sequence(fn (Sequence $sequence): array => [
                'name' => 'ESTRES-Usuario '.($inicio + $sequence->index + 1),
                'email' => 'estres-'.($inicio + $sequence->index + 1).'@sime.test',
            ])
            ->create();

        $this->command->info(self::CANTIDAD.' usuarios de estrés creados exitosamente.');
    }
}
