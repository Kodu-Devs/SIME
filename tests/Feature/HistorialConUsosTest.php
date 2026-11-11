<?php

use App\Models\EventoUso;
use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use App\Models\User;
use Database\Seeders\InstalacionSeeder;
use Database\Seeders\PisoSeeder;
use Database\Seeders\TipoExtintorSeeder;
use Database\Seeders\UbicacionSeeder;

test('el historial carga con eventos de uso registrados', function () {
    $this->withoutVite();

    // Catálogos reales: tipos y ubicaciones
    $this->seed([InstalacionSeeder::class, PisoSeeder::class, UbicacionSeeder::class, TipoExtintorSeeder::class]);

    $admin = User::factory()->create();

    $extintor = Extintor::factory()->create([
        'estatus' => 'Medio uso',
        'tipoextintor_id' => TipoExtintor::value('id'),
        'ubicacion_id' => Ubicacion::value('id'),
        'fecha_instalacion' => today()->subMonths(2)->toDateString(),
        'fecha_vencimiento' => today()->addDays(20)->toDateString(),
    ]);

    EventoUso::create([
        'extintor_id' => $extintor->id,
        'user_id' => $admin->id,
        'fecha' => now()->subDay(),
        'tipo_descarga' => 'parcial',
        'tipo_motivo' => 'Simulacro',
        'motivo' => 'Simulacro de evacuación',
    ]);

    // Con un uso en la base, el with('usuario') sí se resuelve
    $this->actingAs($admin)
        ->get('/historial')
        ->assertOk();
});