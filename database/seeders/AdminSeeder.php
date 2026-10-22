<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');
        $nombre = env('ADMIN_NAME', 'Administrador');

        if (empty($email) || empty($password)) {
            $this->command->info('ADMIN_EMAIL o ADMIN_PASSWORD no definidos. Saltando AdminSeeder para evitar vulnerabilidades.');

            return;
        }

        // User usa SoftDeletes: updateOrCreate solo ve usuarios activos, asi que si el
        // admin estaba dado de baja intentaria insertarlo de nuevo y chocaria con el
        // indice unico de email. Se busca incluyendo bajas y se restaura primero.
        $adminExistente = User::withTrashed()->where('email', $email)->first();

        if ($adminExistente?->trashed()) {
            $adminExistente->restore();
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                // 'name' por el rename de la columna users.nombre
                'name' => $nombre,
                'password' => Hash::make($password),
                'remember_token' => Str::random(10),
            ]
        );

        $this->command->info('Administrador sembrado con éxito.');
    }
}
