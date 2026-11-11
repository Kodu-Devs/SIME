<?php

use App\Models\Capacitacion;
use Database\Seeders\CapacitacionSeeder;
use Database\Seeders\ExtintorSeeder;
use Database\Seeders\InstalacionSeeder;
use Database\Seeders\PisoSeeder;
use Database\Seeders\TipoExtintorSeeder;
use Database\Seeders\UbicacionSeeder;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    $this->seed([
        TipoExtintorSeeder::class,
        InstalacionSeeder::class,
        PisoSeeder::class,
        UbicacionSeeder::class,
        ExtintorSeeder::class,
        CapacitacionSeeder::class,
    ]);
});

test('el seeder aparta extintores en cada capacitación', function () {
    expect(Capacitacion::count())->toBe(6);

    Capacitacion::all()->each(
        fn (Capacitacion $capacitacion) => expect($capacitacion->extintores)->not->toBeEmpty()
    );
});

test('el seeder solo aparta extintores en medio uso', function () {
    $this->assertDatabaseCount('capacitacion_extintor', 12);

    Capacitacion::with('extintores')->get()->each(
        fn (Capacitacion $capacitacion) => $capacitacion->extintores->each(
            fn ($extintor) => expect($extintor->estatus)->toBe('Medio uso')
        )
    );
});

test('correr el seeder otra vez no duplica los extintores apartados', function () {
    $antes = DB::table('capacitacion_extintor')->count();

    expect($antes)->toBeGreaterThan(0);

    $this->seed(CapacitacionSeeder::class);

    expect(DB::table('capacitacion_extintor')->count())->toBe($antes);
});
