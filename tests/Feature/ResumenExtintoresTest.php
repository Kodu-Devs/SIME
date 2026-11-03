<?php

namespace Tests\Feature;

use App\Services\ResumenExtintores;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\Concerns\CreaDatosDeExtintores;
use Tests\TestCase;

class ResumenExtintoresTest extends TestCase
{
    use RefreshDatabase, CreaDatosDeExtintores;

    private ResumenExtintores $resumen;

    protected function setUp(): void
    {
        parent::setUp();

        config(['sime.dias_por_vencer' => 7]);
        $this->resumen = new ResumenExtintores();
    }

    public function test_los_extintores_en_baja_no_cuentan_en_el_total(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio();
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion, ['estatus' => 'Baja']);

        $this->assertSame(2, $this->resumen->total());
    }

    public function test_vencidos_usa_la_fecha_y_excluye_baja(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio();
        $this->crearExtintor($ubicacion, ['fecha_vencimiento' => now()->subDay()]);
        $this->crearExtintor($ubicacion, ['fecha_vencimiento' => now()->subDay(), 'estatus' => 'Baja']);
        $this->crearExtintor($ubicacion);

        $this->assertSame(1, $this->resumen->vencidos());
    }

    public function test_por_vencer_cuenta_los_proximos_7_dias_y_excluye_baja(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio();
        $this->crearExtintor($ubicacion, ['fecha_vencimiento' => now()->addDays(3)]);
        $this->crearExtintor($ubicacion, ['fecha_vencimiento' => now()->addDays(3), 'estatus' => 'Baja']);
        $this->crearExtintor($ubicacion, ['fecha_vencimiento' => now()->addDays(30)]);

        $this->assertSame(1, $this->resumen->porVencer());
    }

    public function test_vigentes_es_total_menos_vencidos_menos_por_vencer(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio();
        $this->crearExtintor($ubicacion, ['fecha_vencimiento' => now()->subDays(2)]);
        $this->crearExtintor($ubicacion, ['fecha_vencimiento' => now()->addDays(2)]);
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion);

        $this->assertSame(4, $this->resumen->total());
        $this->assertSame(1, $this->resumen->vencidos());
        $this->assertSame(1, $this->resumen->porVencer());
        $this->assertSame(2, $this->resumen->vigentes());
    }

    public function test_por_estatus_agrupa_y_excluye_baja(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio();
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion);
        $this->crearExtintor($ubicacion, ['estatus' => 'Vacío']);
        $this->crearExtintor($ubicacion, ['estatus' => 'Baja']);

        $this->assertSame(['Disponible' => 2, 'Vacío' => 1], $this->resumen->porEstatus()->toArray());
    }

    public function test_por_edificio_agrupa_por_nombre_de_instalacion(): void
    {
        $a = $this->crearUbicacionEnNuevoEdificio('Edificio A');
        $b = $this->crearUbicacionEnNuevoEdificio('Edificio B');
        $this->crearExtintor($a);
        $this->crearExtintor($a);
        $this->crearExtintor($b);

        $this->assertSame(['Edificio A' => 2, 'Edificio B' => 1], $this->resumen->porEdificio()->toArray());
    }

    public function test_total_edificios_solo_cuenta_instalaciones_tipo_edificio(): void
    {
        $this->crearEdificio('Edificio A');
        $this->crearEdificio('Edificio B');
        $this->crearEdificio('Cancha', 'Área exterior');

        $this->assertSame(2, $this->resumen->totalEdificios());
    }

    public function test_extintor_vencido_urgente_es_el_mas_antiguo(): void
    {
        $edificio = $this->crearEdificio('Edificio C');
        $piso = $this->crearPiso($edificio, 'Planta baja');
        $ubicacion = $this->crearUbicacion($piso, 'Lab. Programación', 'Laboratorio');

        $this->crearExtintor($ubicacion, ['etiqueta_inventario' => 'RECIENTE', 'fecha_vencimiento' => now()->subDays(10)]);
        $this->crearExtintor($ubicacion, ['etiqueta_inventario' => 'ANTIGUO', 'fecha_vencimiento' => now()->subDays(40)]);

        $urgente = $this->resumen->extintorVencidoUrgente();

        $this->assertSame('ANTIGUO', $urgente['etiqueta']);
        $this->assertSame('Lab. Programación', $urgente['ubicacion']);
        $this->assertSame('Planta baja', $urgente['piso']);
        $this->assertSame('Edificio C', $urgente['edificio']);
        $this->assertSame(40, $urgente['dias_vencido']);
    }

    public function test_extintor_vencido_urgente_es_null_si_no_hay_vencidos(): void
    {
        $this->crearExtintor($this->crearUbicacionEnNuevoEdificio());

        $this->assertNull($this->resumen->extintorVencidoUrgente());
    }

    public function test_proxima_agenda_mezcla_futuros_pendientes_ordenados_por_fecha(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio();
        $extintor = $this->crearExtintor($ubicacion, ['etiqueta_inventario' => 'AG-001']);

        $mantenimiento = fn (string $programada, ?string $realizada = null) => DB::table('mantenimientos')->insert([
            'extintor_id'      => $extintor,
            'tipo'             => 'Revisión',
            'descripcion'      => 'Prueba',
            'fecha_programada' => $programada,
            'fecha_realizada'  => $realizada,
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);

        $capacitacion = fn (string $nombre, string $fecha) => DB::table('capacitaciones')->insert([
            'nombre'       => $nombre,
            'fecha_hora'   => $fecha,
            'ubicacion_id' => $ubicacion,
            'created_at'   => now(),
            'updated_at'   => now(),
        ]);

        $mantenimiento(now()->addDays(5)->toDateTimeString());                                   // entra
        $mantenimiento(now()->addDays(6)->toDateTimeString(), now()->toDateTimeString());        // ya realizado: no
        $mantenimiento(now()->subDays(3)->toDateTimeString());                                   // pasado: no
        $capacitacion('Brigadas', now()->addDays(2)->toDateTimeString());                        // entra
        $capacitacion('Pasada', now()->subDays(2)->toDateTimeString());                          // pasada: no

        $agenda = $this->resumen->proximaAgenda();

        $this->assertCount(2, $agenda);
        $this->assertSame('capacitacion', $agenda[0]['clase']);
        $this->assertSame('Brigadas', $agenda[0]['titulo']);
        $this->assertSame('mantenimiento', $agenda[1]['clase']);
        $this->assertSame(now()->addDays(5)->toDateString(), $agenda[1]['fecha']);
    }

    public function test_proxima_agenda_respeta_el_limite(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio();

        foreach (range(1, 7) as $dia) {
            DB::table('capacitaciones')->insert([
                'nombre'       => "Capacitación {$dia}",
                'fecha_hora'   => now()->addDays($dia)->toDateTimeString(),
                'ubicacion_id' => $ubicacion,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }

        $this->assertCount(5, $this->resumen->proximaAgenda());
        $this->assertCount(3, $this->resumen->proximaAgenda(3));
    }
        public function test_extintor_que_vence_hoy_no_es_vencido_pero_si_por_vencer(): void
    {
        $this->crearExtintor(
            $this->crearUbicacionEnNuevoEdificio(),
            ['fecha_vencimiento' => today()]
        );

        $this->assertSame(1, $this->resumen->total());
        $this->assertSame(0, $this->resumen->vencidos());
        $this->assertSame(1, $this->resumen->porVencer());
        $this->assertSame(0, $this->resumen->vigentes());
    }

    public function test_extintor_que_vence_hoy_guardado_solo_con_fecha_cuenta_igual(): void
    {
        // Igual que el caso anterior, pero la fecha se guarda sin hora ("2026-10-30"),
        // como podría venir de un seeder o de un formulario.
        $this->crearExtintor(
            $this->crearUbicacionEnNuevoEdificio(),
            ['fecha_vencimiento' => today()->toDateString()]
        );

        $this->assertSame(0, $this->resumen->vencidos());
        $this->assertSame(1, $this->resumen->porVencer());
    }

    public function test_extintor_en_baja_que_vence_en_3_dias_no_cuenta_en_ninguno(): void
    {
        $this->crearExtintor(
            $this->crearUbicacionEnNuevoEdificio(),
            ['estatus' => 'Baja', 'fecha_vencimiento' => today()->addDays(3)]
        );

        $this->assertSame(0, $this->resumen->total());
        $this->assertSame(0, $this->resumen->vencidos());
        $this->assertSame(0, $this->resumen->porVencer());
        $this->assertSame(0, $this->resumen->vigentes());
    }

    public function test_por_vencer_incluye_el_dia_7_y_excluye_el_8(): void
    {
        $ubicacion = $this->crearUbicacionEnNuevoEdificio();
        $this->crearExtintor($ubicacion, ['fecha_vencimiento' => today()->addDays(7)->toDateString()]);
        $this->crearExtintor($ubicacion, ['fecha_vencimiento' => today()->addDays(8)->toDateString()]);

        $this->assertSame(1, $this->resumen->porVencer());
    }
}