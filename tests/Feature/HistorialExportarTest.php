<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Tests\Concerns\CreaDatosDeExtintores;
use Tests\TestCase;

class HistorialExportarTest extends TestCase
{
    use RefreshDatabase, CreaDatosDeExtintores;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();

        // Congelamos el reloj: así el folio (INF-XXX-AAAAMMDD-HHMM) siempre es el mismo.
        $this->travelTo(Carbon::create(2026, 11, 2, 20, 39, 0));
    }

    /** Inserta un evento de uso para un extintor. Se puede sobrescribir cualquier campo. */
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

    private function url(array $parametros): string
    {
        return route('historial.exportar', $parametros);
    }

    // ---------- Acceso ----------

    public function test_un_visitante_sin_sesion_es_redirigido_al_login(): void
    {
        $this->get($this->url(['formato' => 'pdf', 'informe' => 'extintores']))
            ->assertRedirect('/login');
    }

    // ---------- Informe de usos ----------

    public function test_el_informe_de_usos_se_descarga_en_pdf(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio('Edificio A');
        $this->crearUso($this->crearExtintor($ubicacion));

        $this->actingAs(User::factory()->create())
            ->get($this->url([
                'formato'      => 'pdf',
                'informe'      => 'usos',
                'fecha_inicio' => '2026-11-01',
                'fecha_fin'    => '2026-11-02',
            ]))
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf')
            ->assertDownload('INF-USO-20261102-2039.pdf');
    }

    public function test_el_informe_de_usos_se_descarga_en_excel(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio('Edificio A');
        $this->crearUso($this->crearExtintor($ubicacion));

        $this->actingAs(User::factory()->create())
            ->get($this->url([
                'formato'      => 'excel',
                'informe'      => 'usos',
                'fecha_inicio' => '2026-11-01',
                'fecha_fin'    => '2026-11-02',
            ]))
            ->assertOk()
            ->assertDownload('INF-USO-20261102-2039.xlsx');
    }

    public function test_el_informe_de_usos_sin_eventos_tambien_se_descarga(): void
    {
        $user = User::factory()->create();

        foreach (['pdf' => '.pdf', 'excel' => '.xlsx'] as $formato => $extension) {
            $this->actingAs($user)
                ->get($this->url([
                    'formato'      => $formato,
                    'informe'      => 'usos',
                    'fecha_inicio' => '2026-11-01',
                    'fecha_fin'    => '2026-11-02',
                ]))
                ->assertOk()
                ->assertDownload('INF-USO-20261102-2039' . $extension);
        }
    }

    // ---------- Lista de extintores ----------

    public function test_la_lista_de_extintores_se_descarga_en_pdf(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio('Edificio A');
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion, ['estatus' => 'Vacío']);

        $this->actingAs(User::factory()->create())
            ->get($this->url(['formato' => 'pdf', 'informe' => 'extintores']))
            ->assertOk()
            ->assertHeader('content-type', 'application/pdf')
            ->assertDownload('INF-EXT-20261102-2039.pdf');
    }

    public function test_la_lista_de_extintores_se_descarga_en_excel(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio('Edificio A');
        $this->crearExtintor($ubicacion);

        $this->actingAs(User::factory()->create())
            ->get($this->url(['formato' => 'excel', 'informe' => 'extintores']))
            ->assertOk()
            ->assertDownload('INF-EXT-20261102-2039.xlsx');
    }

    public function test_la_lista_de_extintores_ignora_las_fechas_y_acepta_filtro_de_edificio(): void
    {
        $edificioId = $this->crearEdificio('Edificio B');
        $pisoId = $this->crearPiso($edificioId);
        $this->crearExtintor($this->crearUbicacion($pisoId));

        $this->actingAs(User::factory()->create())
            ->get($this->url([
                'formato'        => 'pdf',
                'informe'        => 'extintores',
                'instalacion_id' => $edificioId,
                'piso_id'        => $pisoId,
            ]))
            ->assertOk()
            ->assertDownload('INF-EXT-20261102-2039.pdf');
    }

    public function test_la_lista_de_extintores_sin_extintores_tambien_se_descarga(): void
    {
        $user = User::factory()->create();

        foreach (['pdf' => '.pdf', 'excel' => '.xlsx'] as $formato => $extension) {
            $this->actingAs($user)
                ->get($this->url(['formato' => $formato, 'informe' => 'extintores']))
                ->assertOk()
                ->assertDownload('INF-EXT-20261102-2039' . $extension);
        }
    }

    // ---------- Validación ----------

    public function test_un_formato_o_informe_invalido_se_rechaza(): void
    {
        $this->actingAs(User::factory()->create())
            ->get($this->url(['formato' => 'word', 'informe' => 'otro']))
            ->assertSessionHasErrors(['formato', 'informe']);
    }

    public function test_el_informe_de_usos_exige_las_dos_fechas(): void
    {
        $this->actingAs(User::factory()->create())
            ->get($this->url(['formato' => 'pdf', 'informe' => 'usos']))
            ->assertSessionHasErrors(['fecha_inicio', 'fecha_fin']);
    }

    public function test_la_fecha_fin_no_puede_ser_anterior_a_la_inicial(): void
    {
        $this->actingAs(User::factory()->create())
            ->get($this->url([
                'formato'      => 'pdf',
                'informe'      => 'usos',
                'fecha_inicio' => '2026-11-02',
                'fecha_fin'    => '2026-11-01',
            ]))
            ->assertSessionHasErrors(['fecha_fin']);
    }

    public function test_un_piso_sin_edificio_se_rechaza(): void
    {
        $pisoId = $this->crearPiso($this->crearEdificio('Edificio A'));

        $this->actingAs(User::factory()->create())
            ->get($this->url([
                'formato'  => 'pdf',
                'informe'  => 'extintores',
                'piso_id'  => $pisoId,
            ]))
            ->assertSessionHasErrors(['instalacion_id']);
    }

    public function test_un_piso_de_otro_edificio_se_rechaza(): void
    {
        $edificioA = $this->crearEdificio('Edificio A');
        $edificioB = $this->crearEdificio('Edificio B');
        $pisoDeB = $this->crearPiso($edificioB);

        $this->actingAs(User::factory()->create())
            ->get($this->url([
                'formato'        => 'pdf',
                'informe'        => 'extintores',
                'instalacion_id' => $edificioA,
                'piso_id'        => $pisoDeB,
            ]))
            ->assertSessionHasErrors(['piso_id']);
    }
        public function test_la_lista_de_extintores_acepta_un_area_que_no_es_edificio(): void
    {
        $almacen = $this->crearEdificio('Almacén', 'Área');
        $piso = $this->crearPiso($almacen, 'Nivel único');
        $this->crearExtintor($this->crearUbicacion($piso));

        $this->actingAs(User::factory()->create())
            ->get($this->url([
                'formato'        => 'pdf',
                'informe'        => 'extintores',
                'instalacion_id' => $almacen,
                'piso_id'        => $piso,
            ]))
            ->assertOk()
            ->assertDownload('INF-EXT-20261102-2039.pdf');
    }

    public function test_el_informe_de_usos_acepta_un_area_que_no_es_edificio(): void
    {
        $almacen = $this->crearEdificio('Almacén', 'Área');
        $piso = $this->crearPiso($almacen, 'Nivel único');
        $this->crearUso($this->crearExtintor($this->crearUbicacion($piso)));

        $this->actingAs(User::factory()->create())
            ->get($this->url([
                'formato'        => 'excel',
                'informe'        => 'usos',
                'fecha_inicio'   => '2026-11-01',
                'fecha_fin'      => '2026-11-02',
                'instalacion_id' => $almacen,
            ]))
            ->assertOk()
            ->assertDownload('INF-USO-20261102-2039.xlsx');
    }
}