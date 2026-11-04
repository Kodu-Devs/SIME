<?php

use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use App\Models\User;
use Database\Seeders\InstalacionSeeder;
use Database\Seeders\PisoSeeder;
use Database\Seeders\TipoExtintorSeeder;
use Database\Seeders\UbicacionSeeder;

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