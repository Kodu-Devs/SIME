<?php

namespace App\Services;

use App\Models\Extintor;
use App\Models\Instalacion;
use Illuminate\Support\Collection;
use App\Models\Capacitacion;
use App\Models\Mantenimiento;
use Illuminate\Support\Carbon;

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
        public function extintorVencidoUrgente(): ?array
    {
        $extintor = Extintor::vencidos()
            ->join('ubicaciones', 'extintores.ubicacion_id', '=', 'ubicaciones.id')
            ->join('pisos', 'ubicaciones.piso_id', '=', 'pisos.id')
            ->join('instalaciones', 'pisos.instalacion_id', '=', 'instalaciones.id')
            ->orderBy('extintores.fecha_vencimiento')
            ->select(
                'extintores.id',
                'extintores.etiqueta_inventario',
                'extintores.fecha_vencimiento',
                'ubicaciones.nombre as ubicacion',
                'pisos.nombre as piso',
                'instalaciones.nombre as edificio'
            )
            ->first();

        if (! $extintor) {
            return null;
        }

        $vencimiento = Carbon::parse($extintor->fecha_vencimiento)->startOfDay();

        return [
            'id'                => $extintor->id,
            'etiqueta'          => $extintor->etiqueta_inventario,
            'ubicacion'         => $extintor->ubicacion,
            'piso'              => $extintor->piso,
            'edificio'          => $extintor->edificio,
            'fecha_vencimiento' => $vencimiento->toDateString(),
            'dias_vencido'      => (int) abs(today()->diffInDays($vencimiento)),
        ];
    }

    public function proximaAgenda(int $limite = 5): array
    {
        $mantenimientos = Mantenimiento::pendientes()
            ->with('extintor:id,etiqueta_inventario')
            ->whereDate('fecha_programada', '>=', today())
            ->orderBy('fecha_programada')
            ->limit($limite)
            ->get()
            ->map(fn ($m) => [
                'id'        => $m->id,
                'clase'     => 'mantenimiento',
                'titulo'    => $m->tipo . ' ' . ($m->extintor->etiqueta_inventario ?? ''),
                'categoria' => 'Mantenimiento',
                'fecha'     => $m->fecha_programada,
            ]);

        $capacitaciones = Capacitacion::query()
            ->whereDate('fecha_hora', '>=', today())
            ->orderBy('fecha_hora')
            ->limit($limite)
            ->get()
            ->map(fn ($c) => [
                'id'        => $c->id,
                'clase'     => 'capacitacion',
                'titulo'    => $c->nombre,
                'categoria' => 'Capacitación',
                'fecha'     => $c->fecha_hora,
            ]);

        return $mantenimientos
            ->concat($capacitaciones)
            ->sortBy('fecha')
            ->take($limite)
            ->map(fn ($e) => [...$e, 'fecha' => $e['fecha']->toDateString()])
            ->values()
            ->all();
    }
}