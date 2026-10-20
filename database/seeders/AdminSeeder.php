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

        User::updateOrCreate(
            ['email' => $email],
            [
                'nombre' => $nombre,
                'password' => Hash::make($password), 
                'remember_token' => Str::random(10),
            ]
        );
        
        $this->command->info('Administrador sembrado con éxito.');
    }
}