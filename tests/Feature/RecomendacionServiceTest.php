<?php

namespace Tests\Feature;

use App\Services\RecomendacionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreaDatosDeExtintores;
use Tests\TestCase;

class RecomendacionServiceTest extends TestCase
{
    use RefreshDatabase, CreaDatosDeExtintores;

    private RecomendacionService $servicio;

    protected function setUp(): void
    {
        parent::setUp();

        $this->servicio = new RecomendacionService();
    }

    private function mensajes(int $limite = 20): array
    {
        return array_column($this->servicio->generar($limite), 'mensaje');
    }

    public function test_edificio_sin_extintores_genera_recomendacion(): void
    {
        $this->crearEdificio('Edificio D');

        $this->assertSame(['Edificio D: no tiene extintores registrados.'], $this->mensajes());
    }

    public function test_area_exterior_sin_ubicaciones_no_genera_recomendacion(): void
    {
        $this->crearEdificio('Cancha', 'Área exterior');

        $this->assertSame([], $this->mensajes());
    }

    public function test_ubicacion_sin_extintor_disponible(): void
    {
        $piso = $this->crearPiso($this->crearEdificio('Edificio A'), 'Planta baja');
        $this->crearExtintor($this->crearUbicacion($piso, 'Pasillo 1', 'Pasillo'));
        $this->crearExtintor($this->crearUbicacion($piso, 'Bodega', 'Almacén'), ['estatus' => 'Vacío']);

        $this->assertSame(
            ['Bodega (Edificio A): no tiene ningún extintor disponible.'],
            $this->mensajes()
        );
    }

    public function test_los_extintores_en_baja_no_cuentan_como_registrados(): void
    {
        $piso = $this->crearPiso($this->crearEdificio('Edificio A'), 'Planta baja');
        $this->crearExtintor($this->crearUbicacion($piso, 'Pasillo 1', 'Pasillo'));
        $this->crearExtintor($this->crearUbicacion($piso, 'Bodega', 'Almacén'), ['estatus' => 'Baja']);

        $this->assertSame(
            ['Bodega (Edificio A): no tiene extintores registrados.'],
            $this->mensajes()
        );
    }

    public function test_pisos_vacios_del_mismo_edificio_se_agrupan_en_un_solo_mensaje(): void
    {
        $edificio = $this->crearEdificio('Edificio B');
        $planta = $this->crearPiso($edificio, 'Planta baja');
        $this->crearPiso($edificio, 'Nivel 1');
        $this->crearPiso($edificio, 'Nivel 2');
        $this->crearExtintor($this->crearUbicacion($planta, 'Pasillo', 'Pasillo'));

        $this->assertSame(
            ['Edificio B: no tiene extintores registrados en Nivel 1 y Nivel 2.'],
            $this->mensajes()
        );
    }

    public function test_sugiere_el_tipo_segun_el_area_cuando_falta(): void
    {
        $piso = $this->crearPiso($this->crearEdificio('Edificio A'), 'Planta baja');
        $this->crearExtintor($this->crearUbicacion($piso, 'Lab. Redes', 'Laboratorio')); // solo PQS

        $this->assertSame(
            ['Lab. Redes (Edificio A, Planta baja): se sugiere un extintor CO2.'],
            $this->mensajes()
        );
    }

    public function test_no_sugiere_nada_si_ya_tiene_el_tipo_correcto(): void
    {
        $piso = $this->crearPiso($this->crearEdificio('Edificio A'), 'Planta baja');
        $this->crearExtintor(
            $this->crearUbicacion($piso, 'Lab. Redes', 'Laboratorio'),
            ['tipoextintor_id' => $this->tipo('CO2')]
        );

        $this->assertSame([], $this->mensajes());
    }

    public function test_el_limite_por_defecto_es_3_y_se_mezclan_los_tipos_por_gravedad(): void
    {
        $this->crearEdificio('Edificio D'); // edificio vacío

        $edificio = $this->crearEdificio('Edificio E');
        $planta = $this->crearPiso($edificio, 'Planta baja');
        $this->crearPiso($edificio, 'Nivel 1'); // piso vacío
        $this->crearExtintor($this->crearUbicacion($planta, 'Taller 1', 'Taller'));
        $this->crearExtintor($this->crearUbicacion($planta, 'Bodega', 'Almacén'), ['estatus' => 'Vacío']); // sin disponible
        $this->crearExtintor($this->crearUbicacion($planta, 'Lab. Redes', 'Laboratorio'));               // tipo sugerido

        $tipos = fn (array $r) => array_column($r, 'tipo');

        $this->assertSame(['edificio', 'piso', 'ubicacion'], $tipos($this->servicio->generar()));
        $this->assertSame(
            ['edificio', 'piso', 'ubicacion', 'tipo_sugerido'],
            $tipos($this->servicio->generar(20))
        );
    }

        public function test_sin_problemas_devuelve_lista_vacia(): void
    {
        $piso = $this->crearPiso($this->crearEdificio('Edificio A'), 'Planta baja');
        $this->crearExtintor($this->crearUbicacion($piso, 'Pasillo 1', 'Pasillo')); // PQS es el tipo por defecto

        $this->assertSame([], $this->servicio->generar());
    }
}