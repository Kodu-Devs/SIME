<?php

namespace App\Services;

use App\Models\Extintor;

class EstatusExtintor
{
    public function cambiarA(Extintor $extintor, string $estatus)
    {
        $extintor->update([
            'estatus' => $estatus
        ]);
        
        return $extintor;
    }

    public function trasUso(Extintor $extintor, string $tipoDescarga)
    {
        if ($tipoDescarga === 'Total' || $tipoDescarga === 'Parcial') {
            $this->cambiarA($extintor, 'Vacío');
        }
    }

    public function trasMantenimiento($mantenimiento)
    {
        $extintor = $mantenimiento->extintor;
        
        if ($extintor) {
            $this->cambiarA($extintor, 'Disponible');
        }
    }
}