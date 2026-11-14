<?php

use App\Models\EventoUso;
use App\Models\Extintor;
use App\Models\Mantenimiento;
use App\Models\TipoExtintor;
use App\Models\Ubicacion;
use App\Models\User;
use Database\Seeders\InstalacionSeeder;
use Database\Seeders\PisoSeeder;
use Database\Seeders\TipoExtintorSeeder;
use Database\Seeders\UbicacionSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('el filtro tipo=usos solo regresa usos y la paginacion respeta el filtro', function () {
    $this->withoutVite();

    $this->seed([InstalacionSeeder::class, PisoSeeder::class, UbicacionSeeder::class, TipoExtintorSeeder::class]);

    $admin = User::factory()->create();

    $extintor = Extintor::factory()->create([
        'estatus' => 'Vigente',
        'tipoextintor_id' => TipoExtintor::value('id'),
        'ubicacion_id' => Ubicacion::value('id'),
        'fecha_instalacion' => today()->subMonths(2)->toDateString(),
        'fecha_vencimiento' => today()->addDays(60)->toDateString(),
    ]);

    // Creamos 12 usos (deben paginarse en 10 + 2)
    for ($i = 1; $i <= 12; $i++) {
        EventoUso::create([
            'extintor_id' => $extintor->id,
            'user_id' => $admin->id,
            'fecha' => now()->subHours($i),
            'tipo_descarga' => 'parcial',
            'tipo_motivo' => 'Simulacro',
            'motivo' => "Uso registrado #{$i}",
        ]);
    }

    // Creamos 3 mantenimientos realizados (NO deben aparecer cuando tipo=usos)
    for ($i = 1; $i <= 3; $i++) {
        Mantenimiento::create([
            'extintor_id' => $extintor->id,
            'tipo' => 'Revisión',
            'estatus' => 'Realizado',
            'fecha_programada' => now()->subDays($i + 1),
            'fecha_realizada' => now()->subDays($i),
            'descripcion' => "Mantenimiento #{$i}",
        ]);
    }

    // Página 1 con filtro tipo=usos
    $this->actingAs($admin)
        ->get('/historial?tipo=usos')
        ->assertOk()
        ->assertInertia(function (Assert $page) {
            $page->component('Historial/Index')
                ->where('filters.tipo', 'usos')
                ->where('eventos.total', 12)
                ->where('eventos.per_page', 10)
                ->where('eventos.current_page', 1)
                ->has('eventos.data', 10);

            $items = $page->toArray()['props']['eventos']['data'];
            expect(collect($items)->pluck('tipo_evento')->unique()->all())->toBe(['Uso']);
        });

    // Página 2 con filtro tipo=usos
    $this->actingAs($admin)
        ->get('/historial?tipo=usos&page=2')
        ->assertOk()
        ->assertInertia(function (Assert $page) {
            $page->component('Historial/Index')
                ->where('filters.tipo', 'usos')
                ->where('eventos.total', 12)
                ->where('eventos.current_page', 2)
                ->has('eventos.data', 2);

            $items = $page->toArray()['props']['eventos']['data'];
            expect(collect($items)->pluck('tipo_evento')->unique()->all())->toBe(['Uso']);
        });
});