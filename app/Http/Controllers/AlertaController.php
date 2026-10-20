<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Alerta;

class AlertaController extends Controller
{
    /**
     * Muestra la lista de alertas para el modal/panel.
     */
    public function index()
    {
        // TODO: Lógica para devolver las alertas a Inertia
    }

    /**
     * Marca una alerta específica como leída.
     */
    public function marcarLeida(Request $request, $id) // O usar Route Model Binding: (Alerta $alerta)
    {
        // TODO: Lógica para cambiar el status a leído
    }
}