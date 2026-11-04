<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\Concerns\CreaDatosDeExtintores;
use Tests\TestCase;

class HistorialIndexTest extends TestCase
{
    use RefreshDatabase, CreaDatosDeExtintores;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_el_admin_recibe_los_edificios_con_sus_pisos(): void
    {
        $edificio = $this->crearEdificio('Edificio A');
        $this->crearPiso($edificio, 'Planta baja');
        $this->crearEdificio('Almacén', 'Área'); // no es edificio: no debe llegar

        $this->actingAs(User::factory()->create())
            ->get('/historial')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Historial/Index')
                ->has('edificios', 1)
                ->where('edificios.0.nombre', 'Edificio A')
                ->has('edificios.0.pisos', 1)
            );
    }

    public function test_un_visitante_no_recibe_los_edificios(): void
    {
        $this->crearEdificio('Edificio A');

        $this->get('/historial')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Historial/Index')
                ->missing('edificios')
            );
    }
}