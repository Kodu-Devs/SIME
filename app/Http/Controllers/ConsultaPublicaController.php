<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultaPublicaController extends Controller
{
    /**
     * Muestra el mapa público (Solo lectura, sin autenticación).
     */
    public function mapa()
    {
        // TODO: Lógica de mapa vista pública
    }

    /**
     * Muestra la agenda de mantenimientos públicos.
     */
    public function agenda()
    {
        // TODO: Lógica de la agenda pública
    }

    /**
     * Muestra el historial de eventos públicos.
     */
    public function historial()
    {
        // TODO: Lógica del historial público
    }
}