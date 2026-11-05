<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\Concerns\CreaDatosDeExtintores;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase, CreaDatosDeExtintores;
        protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }
    public function test_un_visitante_sin_sesion_es_redirigido_al_login(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_el_admin_ve_el_dashboard_vacio(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where('tarjetas.total_extintores', 0)
                ->where('tarjetas.vencidos', 0)
                ->where('alerta_vencido', null)
                ->has('agenda', 0)
                ->has('recomendaciones', 0)
            );
    }

    public function test_el_dashboard_manda_numeros_reales_y_el_banner(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio('Edificio C');
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion, [
            'etiqueta_inventario' => 'ITJMM-TEST-001',
            'fecha_vencimiento'   => now()->subDays(5),
        ]);

        $this->actingAs(User::factory()->create())
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where('tarjetas.total_extintores', 2)
                ->where('tarjetas.total_edificios', 1)
                ->where('tarjetas.vencidos', 1)
                ->where('tarjetas.vigentes', 1)
                ->where('alerta_vencido.etiqueta', 'ITJMM-TEST-001')
                ->where('alerta_vencido.edificio', 'Edificio C')
            );
    }
}