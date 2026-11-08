<?php

use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use App\Models\User;
use Database\Seeders\InstalacionSeeder;
use Database\Seeders\PisoSeeder;
use Database\Seeders\TipoExtintorSeeder;
use Database\Seeders\UbicacionSeeder;
use App\Models\Alerta;
use App\Services\EstatusExtintor;

beforeEach(function () {
    // Catálogos que necesita un extintor (tipo y ubicación)
    $this->seed([
        InstalacionSeeder::class,
        PisoSeeder::class,
        UbicacionSeeder::class,
        TipoExtintorSeeder::class,
    ]);

    $this->extintor = Extintor::factory()->create([
        'estatus' => 'Disponible',
        'tipoextintor_id' => TipoExtintor::value('id'),
        'ubicacion_id' => Ubicacion::value('id'),
        'fecha_instalacion' => today()->subMonths(2)->toDateString(),
        'fecha_vencimiento' => today()->addDays(20)->toDateString(),
    ]);
});

test('el admin da de baja un extintor sin borrar la fila', function () {
    $this->actingAs(User::factory()->create())
        ->patch(route('extintores.baja', $this->extintor))
        ->assertRedirect(route('extintores.index'));

    // La fila sigue existiendo y su estatus cambió
    $this->assertDatabaseHas('extintores', [
        'id' => $this->extintor->id,
        'estatus' => 'Baja',
    ]);
});

test('sin sesión no se puede dar de baja', function () {
    $this->patch(route('extintores.baja', $this->extintor))
        ->assertRedirect(route('login'));

    // El estatus no cambia
    $this->assertDatabaseHas('extintores', [
        'id' => $this->extintor->id,
        'estatus' => 'Disponible',
    ]);
});


test('la baja cancela pendientes, conserva realizados y cierra alertas', function () {
    $pendiente = $this->extintor->mantenimientos()->create([
        'tipo' => 'Revisión',
        'fecha_programada' => now()->addDays(3),
    ]);

    $realizado = $this->extintor->mantenimientos()->create([
        'tipo' => 'Revisión',
        'fecha_programada' => now()->subDays(10),
        'fecha_realizada' => now()->subDays(10),
    ]);

    $alerta = Alerta::create([
        'extintor_id' => $this->extintor->id,
        'user_id' => User::factory()->create()->id,
        'tipo' => 'Urgente',
        'categoria' => 'vencido',
        'mensaje' => 'Extintor vencido',
        'fecha_generada' => now(),
        'leida' => false,
    ]);

    $this->actingAs(User::factory()->create())
        ->patch(route('extintores.baja', $this->extintor));

    // El pendiente se cancela (soft delete); el realizado se queda como historial
    $this->assertSoftDeleted('mantenimientos', ['id' => $pendiente->id]);
    $this->assertNotSoftDeleted('mantenimientos', ['id' => $realizado->id]);

    // Sus alertas se cierran
    $this->assertDatabaseHas('alertas', ['id' => $alerta->id, 'leida' => true]);
});

test('un extintor en Baja no cambia de estatus', function () {
    $this->extintor->update(['estatus' => 'Baja']);

    EstatusExtintor::cambiarA($this->extintor, 'Disponible');

    expect($this->extintor->fresh()->estatus)->toBe('Baja');
});