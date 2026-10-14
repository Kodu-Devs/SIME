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
        // Lee las credenciales desde el entorno
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');
        $name = env('ADMIN_NAME', 'Administrador');

        // Medida de seguridad: Si no hay datos, abortamos silenciosamente
        if (empty($email) || empty($password)) {
            $this->command->info('ADMIN_EMAIL o ADMIN_PASSWORD no definidos. Saltando AdminSeeder para evitar vulnerabilidades.');
            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'nombre' => $name,
                'password' => Hash::make($password), 
                'remember_token' => Str::random(10),
            ]
        );
        
        $this->command->info('Administrador sembrado con éxito.');
    }
}