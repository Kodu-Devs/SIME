<?php

namespace App\Services;

use App\Models\Extintor;
use App\Models\Instalacion;
use Illuminate\Support\Collection;

class ResumenExtintores
{
    public function total(): int
    {
        return Extintor::where('estatus', '!=', 'Baja')->count();
    }

    public function porEstatus(): Collection
    {
        return Extintor::where('estatus', '!=', 'Baja')
            ->selectRaw('estatus, count(*) as total')
            ->groupBy('estatus')
            ->pluck('total', 'estatus');
    }

    public function porTipo(): Collection
    {
        return Extintor::join('tipo_extintor', 'extintores.tipoextintor_id', '=', 'tipo_extintor.id')
            ->where('extintores.estatus', '!=', 'Baja')
            ->groupBy('tipo_extintor.nombre')
            ->selectRaw('tipo_extintor.nombre as nombre, count(*) as total')
            ->pluck('total', 'nombre');
    }

    public function porEdificio(): Collection
    {
        return Extintor::join('ubicaciones', 'extintores.ubicacion_id', '=', 'ubicaciones.id')
            ->join('pisos', 'ubicaciones.piso_id', '=', 'pisos.id')
            ->join('instalaciones', 'pisos.instalacion_id', '=', 'instalaciones.id')
            ->where('extintores.estatus', '!=', 'Baja')
            ->groupBy('instalaciones.nombre')
            ->selectRaw('instalaciones.nombre as nombre, count(*) as total')
            ->pluck('total', 'nombre');
    }

    public function vencidos(): int
    {
        return Extintor::vencidos()->count();
    }

    public function porVencer(): int
    {
        return Extintor::porVencer(config('sime.dias_por_vencer', 7))
            ->where('estatus', '!=', 'Baja')
            ->count();
    }

    public function vigentes(): int
    {
        return $this->total() - $this->vencidos() - $this->porVencer();
    }

    public function totalEdificios(): int
    {
        return Instalacion::where('tipo', 'Edificio')->count();
    }
}