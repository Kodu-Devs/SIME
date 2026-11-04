<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\InformesHistorial;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\Concerns\CreaDatosDeExtintores;
use Tests\TestCase;

class InformesHistorialTest extends TestCase
{
    use RefreshDatabase, CreaDatosDeExtintores;

    protected function setUp(): void
    {
        parent::setUp();

        $this->travelTo(Carbon::create(2026, 11, 2, 20, 39, 0));
    }

    private function crearUso(int $extintorId, array $atributos = []): int
    {
        return DB::table('evento_uso')->insertGetId(array_merge([
            'extintor_id'   => $extintorId,
            'user_id'       => User::factory()->create()->id,
            'fecha'         => now()->subHour(),
            'motivo'        => 'Prueba de descarga',
            'tipo_motivo'   => 'Incendio',
            'tipo_descarga' => 'Total',
            'created_at'    => now(),
            'updated_at'    => now(),
        ], $atributos));
    }

    private function servicio(): InformesHistorial
    {
        return app(InformesHistorial::class);
    }

    // ---------- Lista de extintores ----------

    public function test_la_lista_cuenta_por_estatus_y_deja_fuera_los_de_baja(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio('Edificio A');
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion, ['estatus' => 'Vacío']);
        $this->crearExtintor($ubicacion, ['estatus' => 'Baja']);

        $datos = $this->servicio()->extintores([]);

        $this->assertSame(3, $datos['resumen']['total']);
        $this->assertSame(2, $datos['resumen']['por_estatus']['Disponible']);
        $this->assertSame(1, $datos['resumen']['por_estatus']['Vacío']);
        $this->assertArrayNotHasKey('Baja', $datos['resumen']['por_estatus']);
        $this->assertCount(3, $datos['filas']);
    }

    public function test_la_lista_agrupa_por_tipo_con_su_clase_de_fuego(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio('Edificio A');
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion, ['tipoextintor_id' => $this->tipo('CO2')]);

        $porTipo = collect($this->servicio()->extintores([])['por_tipo']);

        $this->assertSame(2, $porTipo->firstWhere('tipo', 'PQS')['cantidad']);
        $this->assertSame(1, $porTipo->firstWhere('tipo', 'CO2')['cantidad']);
        $this->assertSame('ABC', $porTipo->firstWhere('tipo', 'PQS')['clase_fuego']);
    }

    public function test_la_lista_filtra_por_edificio(): void
    {
        $this->crearExtintor($this->crearUbicacionEnNuevoEdificio('Edificio A'));
        $edificioB = $this->crearEdificio('Edificio B');
        $this->crearExtintor($this->crearUbicacion($this->crearPiso($edificioB)));
        $this->crearExtintor($this->crearUbicacion($this->crearPiso($edificioB, 'Nivel 1')));

        $datos = $this->servicio()->extintores(['instalacion_id' => $edificioB]);

        $this->assertSame(2, $datos['resumen']['total']);
        $this->assertSame('Edificio B', $datos['encabezado']['area']);
    }

    public function test_el_encabezado_de_la_lista_trae_folio_y_fecha(): void
    {
        $datos = $this->servicio()->extintores([]);

        $this->assertSame('INF-EXT-20261102-2039', $datos['encabezado']['folio']);
        $this->assertSame('Inventario al 02/11/2026', $datos['encabezado']['inventario']);
        $this->assertSame('Todo el plantel', $datos['encabezado']['area']);
    }

    // ---------- Informe de usos ----------

    public function test_los_usos_respetan_el_rango_de_fechas(): void
    {
        $extintor = $this->crearExtintor($this->crearUbicacionEnNuevoEdificio('Edificio A'));
        $this->crearUso($extintor, ['fecha' => '2026-10-15 10:00:00']); // fuera
        $this->crearUso($extintor, ['fecha' => '2026-11-01 09:00:00']); // dentro
        $this->crearUso($extintor, ['fecha' => '2026-11-02 18:00:00']); // dentro (último día)

        $datos = $this->servicio()->usos([
            'fecha_inicio' => '2026-11-01',
            'fecha_fin'    => '2026-11-02',
        ]);

        $this->assertSame(2, $datos['resumen']['eventos']);
        $this->assertCount(2, $datos['filas']);
        $this->assertSame('INF-USO-20261102-2039', $datos['encabezado']['folio']);
    }

    public function test_los_usos_filtran_por_edificio(): void
    {
        $extintorA = $this->crearExtintor($this->crearUbicacionEnNuevoEdificio('Edificio A'));
        $extintorB = $this->crearExtintor($this->crearUbicacionEnNuevoEdificio('Edificio B'));
        $edificioB = DB::table('instalaciones')->where('nombre', 'Edificio B')->value('id');

        $this->crearUso($extintorA);
        $this->crearUso($extintorB);
        $this->crearUso($extintorB);

        $datos = $this->servicio()->usos([
            'fecha_inicio'   => '2026-11-01',
            'fecha_fin'      => '2026-11-02',
            'instalacion_id' => $edificioB,
        ]);

        $this->assertSame(2, $datos['resumen']['eventos']);
        $this->assertSame('Edificio B', $datos['encabezado']['area']);
    }

    public function test_los_usos_incluyen_extintores_dados_de_baja(): void
    {
        $extintor = $this->crearExtintor(
            $this->crearUbicacionEnNuevoEdificio('Edificio A'),
            ['estatus' => 'Baja'],
        );
        $this->crearUso($extintor);

        $datos = $this->servicio()->usos([
            'fecha_inicio' => '2026-11-01',
            'fecha_fin'    => '2026-11-02',
        ]);

        $this->assertSame(1, $datos['resumen']['eventos']);
    }
        // ---------- Combos del modal ----------

    public function test_edificios_trae_solo_edificios_con_sus_pisos(): void
    {
        $edificioB = $this->crearEdificio('Edificio B');
        $edificioA = $this->crearEdificio('Edificio A');
        $this->crearPiso($edificioA, 'Planta baja');
        $this->crearPiso($edificioA, 'Nivel 1');
        $this->crearPiso($edificioB, 'Planta baja');

        // No es un edificio: no debe aparecer en el combo.
        $almacen = $this->crearEdificio('Almacén', 'Área');
        $this->crearPiso($almacen, 'Nivel único');

        $edificios = $this->servicio()->edificios();

        // Salen ordenados por nombre y sin el almacén.
        $this->assertSame(['Edificio A', 'Edificio B'], $edificios->pluck('nombre')->all());

        // Cada edificio trae sus propios pisos.
        $this->assertSame(['Planta baja', 'Nivel 1'], $edificios->first()->pisos->pluck('nombre')->all());
        $this->assertCount(1, $edificios->last()->pisos);
    }
}