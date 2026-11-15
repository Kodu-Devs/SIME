<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Instalacion;
use App\Models\Piso;
use App\Models\Ubicacion;
use Inertia\Testing\AssertableInertia as Assert;

class ExtintorControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_filtro_vacio_y_paginacion_conserva_parametros()
    {
        // 1. Simulación de Autenticación
        $user = User::factory()->create();
        $this->actingAs($user);

        // 2. Creación del Tipo de Extintor (con todos los campos obligatorios)
        $tipo = TipoExtintor::forceCreate([
            'nombre'          => 'PQS',
            'agente_extintor' => 'Polvo Químico Seco',
            'clase_fuego'     => 'A, B, C',
            'unidad'          => 'kg'
        ]);

        // 3. Creación de Instalación
        $instalacion = Instalacion::forceCreate([
            'nombre' => 'Edificio de Pruebas',
            'tipo'   => 'Interior'
        ]);

        // 4. Creación del Piso (Sin 'numero', porque tu migración no lo tiene)
        $piso = Piso::forceCreate([
            'instalacion_id' => $instalacion->id,
            'nombre'         => 'Planta Baja'
        ]);

        // 5. Creación de Ubicación
        $ubicacion = Ubicacion::forceCreate([
            'piso_id'   => $piso->id,
            'tipo_area' => 'Oficina',
            'nombre'    => 'Pasillo Central'
        ]);

        // 6. Generación de Extintores
        // Agregamos 'capacidad' por si tu factory tampoco la genera automáticamente
        Extintor::factory()->create([
            'estatus'           => 'Disponible',
            'tipoextintor_id'   => $tipo->id,
            'ubicacion_id'      => $ubicacion->id,
            'fecha_instalacion' => now()->subMonths(6)->toDateTimeString(),
            'fecha_vencimiento' => now()->addMonths(6)->toDateTimeString(),
            'capacidad'         => '4.5',
        ]);

        Extintor::factory()->count(8)->create([
            'estatus'           => 'Vacío',
            'tipoextintor_id'   => $tipo->id,
            'ubicacion_id'      => $ubicacion->id,
            'fecha_instalacion' => now()->subMonths(12)->toDateTimeString(),
            'fecha_vencimiento' => now()->subDays(5)->toDateTimeString(),
            'capacidad'         => '6.0',
        ]);
        
        // 7. Aserciones de la Primera Página
        $response = $this->get('/extintores?filtro=Vacíos');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Extintores/Index')
            ->where('filtroActivo', 'Vacíos')
            ->has('extintores.data', 7) 
            ->where('extintores.data.0.estatus', 'Vacío')
        );

        // 8. Aserciones de la Segunda Página
        $responsePagina2 = $this->get('/extintores?filtro=Vacíos&page=2');
        
        $responsePagina2->assertStatus(200);
        $responsePagina2->assertInertia(fn (Assert $page) => $page
            ->has('extintores.data', 1)
            ->where('extintores.data.0.estatus', 'Vacío')
        );
    }
}