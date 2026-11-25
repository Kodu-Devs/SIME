<?php

use App\Models\Alerta;
use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use App\Models\User;
use Database\Seeders\InstalacionSeeder;
use Database\Seeders\PisoSeeder;
use Database\Seeders\TipoExtintorSeeder;
use Database\Seeders\UbicacionSeeder;

test('registrar un uso total cambia el extintor a Vacío y genera alerta Urgente', function () {
    $this->seed([InstalacionSeeder::class, PisoSeeder::class, UbicacionSeeder::class, TipoExtintorSeeder::class]);

    $admin = User::factory()->create();

    $extintor = Extintor::factory()->create([
        'estatus' => 'Disponible',
        'tipoextintor_id' => TipoExtintor::value('id'),
        'ubicacion_id' => Ubicacion::value('id'),
        'fecha_instalacion' => today()->subMonths(2)->toDateString(),
        'fecha_vencimiento' => today()->addDays(60)->toDateString(),
    ]);

  // En la primera prueba:
    $this->actingAs($admin)
        ->post('/historial/usos', [
            'extintor_id' => $extintor->id,
            'tipo_descarga' => 'Total',
            'fecha' => now()->subHour()->format('Y-m-d H:i:s'),
            'tipo_motivo' => 'Simulacro',
            'motivo' => 'Descarga completa en práctica',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($extintor->fresh()->estatus)->toBe('Vacío');

    $this->assertDatabaseHas('alertas', [
        'extintor_id' => $extintor->id,
        'tipo' => 'Urgente',
        'categoria' => 'estatus',
        'leida' => false,
    ]);
});

test('registrar un uso parcial cambia el extintor a Medio uso sin alerta urgente de estatus', function () {
    $this->seed([InstalacionSeeder::class, PisoSeeder::class, UbicacionSeeder::class, TipoExtintorSeeder::class]);

    $admin = User::factory()->create();

    $extintor = Extintor::factory()->create([
        'estatus' => 'Disponible',
        'tipoextintor_id' => TipoExtintor::value('id'),
        'ubicacion_id' => Ubicacion::value('id'),
        'fecha_instalacion' => today()->subMonths(2)->toDateString(),
        'fecha_vencimiento' => today()->addDays(60)->toDateString(),
    ]);

  $this->actingAs($admin)
        ->post('/historial/usos', [
            'extintor_id' => $extintor->id,
            'tipo_descarga' => 'parcial',
            'fecha' => now()->subHour()->format('Y-m-d H:i:s'),
            'tipo_motivo' => 'Simulacro',
            'motivo' => 'Descarga parcial en práctica',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($extintor->fresh()->estatus)->toBe('Medio uso');

    expect(
        Alerta::where('extintor_id', $extintor->id)
            ->where('categoria', 'estatus')
            ->exists()
    )->toBeFalse();
});