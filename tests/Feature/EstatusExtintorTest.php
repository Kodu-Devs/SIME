<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Extintor;
use App\Models\Mantenimiento;
use App\Services\EstatusExtintor;
use Carbon\Carbon;

class EstatusExtintorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_revision_avanza_el_vencimiento_un_periodo()
    {
        // 1. Tomamos un extintor de los que creó el seeder
        $extintor = Extintor::where('estatus', '!=', 'Baja')->first();
        $extintor->fecha_instalacion = Carbon::now()->subMonths(5)->toDateString();
        $extintor->fecha_vencimiento = Carbon::now()->addMonths(7)->toDateString();
        $extintor->estatus = 'Disponible';
        $extintor->save();

        // 2. Creamos la instancia en memoria del mantenimiento
        $mantenimiento = new Mantenimiento();
        $mantenimiento->tipo = 'Revisión';
        $mantenimiento->setRelation('extintor', $extintor);

        // 3. Ejecutamos tu servicio
        EstatusExtintor::trasMantenimiento($mantenimiento);

        $extintor->refresh();

        // 4. Comprobamos la nueva fecha
        $fechaEsperada = Extintor::calcularVencimiento($extintor->fecha_instalacion, 1);
        $this->assertEquals($fechaEsperada->toDateString(), Carbon::parse($extintor->fecha_vencimiento)->toDateString());
    }

    public function test_mantenimiento_otra_no_mueve_el_vencimiento()
    {
        $fechaVencimientoOriginal = Carbon::now()->addMonths(7)->toDateString();
        
        $extintor = Extintor::where('estatus', '!=', 'Baja')->first();
        $extintor->fecha_vencimiento = $fechaVencimientoOriginal;
        $extintor->estatus = 'Disponible';
        $extintor->save();

        $mantenimiento = new Mantenimiento();
        $mantenimiento->tipo = 'Otra';
        $mantenimiento->setRelation('extintor', $extintor);

        EstatusExtintor::trasMantenimiento($mantenimiento);

        $extintor->refresh();

        // La fecha no debió cambiar
        $this->assertEquals($fechaVencimientoOriginal, Carbon::parse($extintor->fecha_vencimiento)->toDateString());
    }

    public function test_extintor_en_baja_no_cambia()
    {
        $fechaVencimientoOriginal = Carbon::now()->addMonths(2)->toDateString();
        
        $extintor = Extintor::first();
        $extintor->estatus = 'Baja';
        $extintor->fecha_vencimiento = $fechaVencimientoOriginal;
        $extintor->save();

        $mantenimiento = new Mantenimiento();
        $mantenimiento->tipo = 'Revisión';
        $mantenimiento->setRelation('extintor', $extintor);

        EstatusExtintor::trasMantenimiento($mantenimiento);

        $extintor->refresh();

        // Ni la fecha ni el estatus deben cambiar
        $this->assertEquals($fechaVencimientoOriginal, Carbon::parse($extintor->fecha_vencimiento)->toDateString());
        $this->assertEquals('Baja', $extintor->estatus);
    }
}