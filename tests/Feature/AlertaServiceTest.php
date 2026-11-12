<?php

use App\Models\Alerta;
use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use App\Models\User;
use App\Services\AlertaService;
use Database\Seeders\InstalacionSeeder;
use Database\Seeders\PisoSeeder;
use Database\Seeders\TipoExtintorSeeder;
use Database\Seeders\UbicacionSeeder;

beforeEach(function () {
    $this->seed([InstalacionSeeder::class, PisoSeeder::class, UbicacionSeeder::class, TipoExtintorSeeder::class]);

    // Las alertas se generan para el administrador
    $this->admin = User::factory()->create();

    $this->extintor = Extintor::factory()->create([
        'estatus' => 'Disponible',
        'tipoextintor_id' => TipoExtintor::value('id'),
        'ubicacion_id' => Ubicacion::value('id'),
        'fecha_instalacion' => today()->subMonths(2)->toDateString(),
        'fecha_vencimiento' => today()->addDays(20)->toDateString(),
    ]);
});

test('reprogramar un mantenimiento fuera del rango cierra su alerta', function () {
    $m = $this->extintor->mantenimientos()->create([
        'tipo' => 'Revisión',
        'fecha_programada' => now()->addDays(3),
    ]);

    // Dentro de los 7 días: se crea la alerta "próximo"
    AlertaService::evaluarMantenimiento($m);
    expect(Alerta::where('mantenimiento_id', $m->id)->noLeidas()->count())->toBe(1);

    // Se reprograma a un mes: queda fuera del rango y la alerta se cierra
    $m->update(['fecha_programada' => now()->addMonth()]);
    AlertaService::evaluarMantenimiento($m->fresh());
    expect(Alerta::where('mantenimiento_id', $m->id)->noLeidas()->count())->toBe(0);
});

test('un extintor en Baja queda sin alertas abiertas', function () {
    foreach (['vencido', 'estatus'] as $categoria) {
        Alerta::create([
            'extintor_id' => $this->extintor->id,
            'user_id' => $this->admin->id,
            'tipo' => 'Urgente',
            'categoria' => $categoria,
            'mensaje' => 'Alerta de prueba',
            'fecha_generada' => now(),
            'leida' => false,
        ]);
    }

    $this->extintor->update(['estatus' => 'Baja']);
    AlertaService::evaluarExtintor($this->extintor->fresh());

    expect(Alerta::where('extintor_id', $this->extintor->id)->noLeidas()->count())->toBe(0);
});