<?php

use App\Models\Alerta;
use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use App\Models\User;
use App\Services\AlertaService;
use Illuminate\Support\Carbon;
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

// ---------------------------------------------------------------
// Extintor: estado de vencimiento
// Las fechas se fijan con travelTo para que el resultado no dependa
// del día en que se corran las pruebas.
// ---------------------------------------------------------------

test('un extintor vencido genera alerta urgente y cierra la de por vencer', function () {
    $this->travelTo(Carbon::parse('2026-06-15 10:00'));

    // Vence en 3 días: queda "por vencer"
    $this->extintor->update(['fecha_vencimiento' => '2026-06-18']);
    AlertaService::evaluarExtintor($this->extintor->fresh());

    // Pasa la fecha de vencimiento: ahora está vencido
    $this->travelTo(Carbon::parse('2026-06-19 10:00'));
    AlertaService::evaluarExtintor($this->extintor->fresh());

    $abiertas = Alerta::where('extintor_id', $this->extintor->id)->noLeidas();

    expect((clone $abiertas)->where('categoria', 'vencido')->where('tipo', 'Urgente')->count())->toBe(1);
    expect((clone $abiertas)->where('categoria', 'por_vencer')->count())->toBe(0);
});

test('un extintor por vencer genera alerta próxima y cierra la de vencido', function () {
    $this->travelTo(Carbon::parse('2026-06-15 10:00'));

    // Venció ayer
    $this->extintor->update(['fecha_vencimiento' => '2026-06-14']);
    AlertaService::evaluarExtintor($this->extintor->fresh());

    // Se corrige la fecha y ahora vence en 5 días
    $this->extintor->update(['fecha_vencimiento' => '2026-06-20']);
    AlertaService::evaluarExtintor($this->extintor->fresh());

    $abiertas = Alerta::where('extintor_id', $this->extintor->id)->noLeidas();

    expect((clone $abiertas)->where('categoria', 'por_vencer')->where('tipo', 'Próximo')->count())->toBe(1);
    expect((clone $abiertas)->where('categoria', 'vencido')->count())->toBe(0);
});

test('un extintor vigente cierra las alertas de vencido y por vencer', function () {
    $this->travelTo(Carbon::parse('2026-06-15 10:00'));

    // Alertas abiertas de antes
    foreach (['vencido', 'por_vencer'] as $categoria) {
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

    // Recibe mantenimiento: vence dentro de un mes
    $this->extintor->update(['fecha_vencimiento' => '2026-07-15']);
    AlertaService::evaluarExtintor($this->extintor->fresh());

    expect(Alerta::where('extintor_id', $this->extintor->id)->noLeidas()->count())->toBe(0);
});

test('por vencer incluye el último día del rango y excluye el siguiente', function () {
    $this->travelTo(Carbon::parse('2026-06-15 10:00'));
    $dias = config('sime.dias_por_vencer');

    // Justo en el último día del rango: sí es "por vencer"
    $this->extintor->update(['fecha_vencimiento' => today()->addDays($dias)->toDateString()]);
    AlertaService::evaluarExtintor($this->extintor->fresh());

    expect(Alerta::where('extintor_id', $this->extintor->id)
        ->where('categoria', 'por_vencer')->noLeidas()->count())->toBe(1);

    // Un día después: ya es vigente y la alerta se cierra
    $this->extintor->update(['fecha_vencimiento' => today()->addDays($dias + 1)->toDateString()]);
    AlertaService::evaluarExtintor($this->extintor->fresh());

    expect(Alerta::where('extintor_id', $this->extintor->id)
        ->where('categoria', 'por_vencer')->noLeidas()->count())->toBe(0);
});

// ---------------------------------------------------------------
// Extintor: estatus
// ---------------------------------------------------------------

test('un extintor vacío o fuera de servicio genera alerta urgente de estatus', function (string $estatus) {
    $this->extintor->update(['estatus' => $estatus]);
    AlertaService::evaluarExtintor($this->extintor->fresh());

    expect(Alerta::where('extintor_id', $this->extintor->id)
        ->where('categoria', 'estatus')->where('tipo', 'Urgente')
        ->noLeidas()->count())->toBe(1);
})->with(['Vacío', 'Fuera de servicio']);

test('al volver a disponible se cierra la alerta de estatus', function () {
    $this->extintor->update(['estatus' => 'Vacío']);
    AlertaService::evaluarExtintor($this->extintor->fresh());

    $this->extintor->update(['estatus' => 'Disponible']);
    AlertaService::evaluarExtintor($this->extintor->fresh());

    expect(Alerta::where('extintor_id', $this->extintor->id)
        ->where('categoria', 'estatus')->noLeidas()->count())->toBe(0);
});

// ---------------------------------------------------------------
// Mantenimiento
// ---------------------------------------------------------------

test('un mantenimiento atrasado genera alerta urgente y cierra la próxima', function () {
    $this->travelTo(Carbon::parse('2026-06-15 10:00'));

    // Programado en 2 días: alerta "Próximo"
    $m = $this->extintor->mantenimientos()->create([
        'tipo' => 'Revisión',
        'fecha_programada' => Carbon::parse('2026-06-17 09:00'),
    ]);
    AlertaService::evaluarMantenimiento($m);

    // Pasa la fecha sin realizarse: ahora está atrasado
    $this->travelTo(Carbon::parse('2026-06-18 10:00'));
    AlertaService::evaluarMantenimiento($m->fresh());

    $abiertas = Alerta::where('mantenimiento_id', $m->id)->where('categoria', 'mantenimiento')->noLeidas();

    expect((clone $abiertas)->where('tipo', 'Urgente')->count())->toBe(1);
    expect((clone $abiertas)->where('tipo', 'Próximo')->count())->toBe(0);
});

test('un mantenimiento atrasado reprogramado dentro del rango vuelve a próximo', function () {
    $this->travelTo(Carbon::parse('2026-06-15 10:00'));

    // Debía hacerse hace 5 días: alerta "Urgente"
    $m = $this->extintor->mantenimientos()->create([
        'tipo' => 'Revisión',
        'fecha_programada' => Carbon::parse('2026-06-10 09:00'),
    ]);
    AlertaService::evaluarMantenimiento($m);

    // Se reprograma para dentro de 3 días
    $m->update(['fecha_programada' => Carbon::parse('2026-06-18 09:00')]);
    AlertaService::evaluarMantenimiento($m->fresh());

    $abiertas = Alerta::where('mantenimiento_id', $m->id)->where('categoria', 'mantenimiento')->noLeidas();

    expect((clone $abiertas)->where('tipo', 'Próximo')->count())->toBe(1);
    expect((clone $abiertas)->where('tipo', 'Urgente')->count())->toBe(0);
});

test('mantenimiento próximo incluye el último día del rango y excluye el siguiente', function () {
    $this->travelTo(Carbon::parse('2026-06-15 10:00'));
    $dias = config('sime.dias_por_vencer');

    // Justo en el último día del rango: sí genera "Próximo"
    $m = $this->extintor->mantenimientos()->create([
        'tipo' => 'Revisión',
        'fecha_programada' => today()->addDays($dias)->setTime(9, 0),
    ]);
    AlertaService::evaluarMantenimiento($m);

    expect(Alerta::where('mantenimiento_id', $m->id)->where('tipo', 'Próximo')->noLeidas()->count())->toBe(1);

    // Un día después: queda fuera del rango y la alerta se cierra
    $m->update(['fecha_programada' => today()->addDays($dias + 1)->setTime(9, 0)]);
    AlertaService::evaluarMantenimiento($m->fresh());

    expect(Alerta::where('mantenimiento_id', $m->id)->noLeidas()->count())->toBe(0);
});

test('un mantenimiento realizado cierra su alerta', function () {
    $this->travelTo(Carbon::parse('2026-06-15 10:00'));

    // Atrasado: alerta "Urgente"
    $m = $this->extintor->mantenimientos()->create([
        'tipo' => 'Revisión',
        'fecha_programada' => Carbon::parse('2026-06-10 09:00'),
    ]);
    AlertaService::evaluarMantenimiento($m);
    expect(Alerta::where('mantenimiento_id', $m->id)->noLeidas()->count())->toBe(1);

    // Se realiza hoy
    $m->update(['fecha_realizada' => today()]);
    AlertaService::evaluarMantenimiento($m->fresh());

    expect(Alerta::where('mantenimiento_id', $m->id)->noLeidas()->count())->toBe(0);
});