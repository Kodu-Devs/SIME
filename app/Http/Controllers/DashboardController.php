<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'tarjetas' => [
                'total_extintores' => 35,
                'total_edificios'  => 4,
                'vigentes'         => 20,
                'por_vencer'       => 5,
                'vencidos'         => 2,
            ],
        ]);
    }
}