<?php

namespace App\Http\Controllers;

use App\Services\ResumenExtintores;
use App\Services\RecomendacionService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(ResumenExtintores $resumen, RecomendacionService $recomendaciones): Response
    {
        $mapa = $resumen->resumenParaMapa();

        return Inertia::render('Dashboard', [
            'tarjetas' => [
                'total_extintores' => $resumen->total(),
                'total_edificios'  => $resumen->totalEdificios(),
                'vigentes'         => $resumen->vigentes(),
                'por_vencer'       => $resumen->porVencer(),
                'vencidos'         => $resumen->vencidos(),
            ],
            'alerta_vencido'  => $resumen->extintorVencidoUrgente(),
            'agenda'          => $resumen->proximaAgenda(),
            'recomendaciones' => $recomendaciones->generar(),
            'instalaciones'   => $mapa['instalaciones'],
            'porEdificio'     => $mapa['porEdificio'],
        ]);
    }
}
