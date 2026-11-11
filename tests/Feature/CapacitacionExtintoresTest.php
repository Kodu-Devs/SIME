<?php

use App\Models\Capacitacion;
use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use App\Models\User;
use Database\Seeders\InstalacionSeeder;
use Database\Seeders\PisoSeeder;
use Database\Seeders\TipoExtintorSeeder;
use Database\Seeders\UbicacionSeeder;

beforeEach(function () {
    $this->withoutVite();
    $this->seed([InstalacionSeeder::class, PisoSeeder::class, UbicacionSeeder::class, TipoExtintorSeeder::class]);

    $this->admin = User::factory()->create();

    $crearExtintor = fn () => Extintor::factory()->create([
        'estatus' => 'Medio uso',
        'tipoextintor_id' => TipoExtintor::value('id'),
        'ubicacion_id' => Ubicacion::value('id'),
        'fecha_instalacion' => today()->subMonths(2)->toDateString(),
        'fecha_vencimiento' => today()->addDays(20)->toDateString(),
    ]);
    $this->e1 = $crearExtintor();
    $this->e2 = $crearExtintor();

    $this->fecha = now()->addWeek();
    $this->datos = fn (array $extintores) => [
        'nombre' => 'Práctica de prueba',
        'fecha_hora' => $this->fecha->format('Y-m-d H:i:s'),
        'ubicacion_id' => Ubicacion::value('id'),
        'extintores_id' => $extintores,
    ];
});

test('crear una capacitación aparta sus extintores', function () {
    $this->actingAs($this->admin)
        ->post(route('agenda.capacitaciones.store'), ($this->datos)([$this->e1->id, $this->e2->id]))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseCount('capacitacion_extintor', 2);
});

test('editar quitando un extintor deja solo el otro', function () {
    $capacitacion = Capacitacion::create([
        'nombre' => 'Práctica de prueba',
        'fecha_hora' => $this->fecha,
        'ubicacion_id' => Ubicacion::value('id'),
    ]);
    $capacitacion->extintores()->sync([$this->e1->id, $this->e2->id]);

    $this->actingAs($this->admin)
        ->put(route('agenda.capacitaciones.update', $capacitacion), ($this->datos)([$this->e1->id]))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseCount('capacitacion_extintor', 1);
    $this->assertDatabaseHas('capacitacion_extintor', ['extintor_id' => $this->e1->id]);
});

test('un extintor inexistente da error de validación, no 500', function () {
    $this->actingAs($this->admin)
        ->post(route('agenda.capacitaciones.store'), ($this->datos)([99999]))
        ->assertSessionHasErrors('extintores_id.0');
});

test('el calendario carga con capacitaciones que tienen apartados', function () {
    $capacitacion = Capacitacion::create([
        'nombre' => 'Práctica de prueba',
        'fecha_hora' => $this->fecha,
        'ubicacion_id' => Ubicacion::value('id'),
    ]);
    $capacitacion->extintores()->sync([$this->e1->id]);

    $this->actingAs($this->admin)
        ->get(route('agenda.index', ['mes' => $this->fecha->format('Y-m')]))
        ->assertOk();
});