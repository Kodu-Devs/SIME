<?php

namespace App\Services;

use App\Models\Extintor;
use App\Models\Mantenimiento;

class EstatusExtintor
{
    public static function cambiarA(Extintor $extintor, string $estatus)
    {
        $extintor->update([
            'estatus' => $estatus
        ]);

        return $extintor;
    }

    public static function trasUso(Extintor $extintor, string $tipoDescarga)
    {
        if ($tipoDescarga === 'Total' || $tipoDescarga === 'Parcial') {
            self::cambiarA($extintor, 'Vacío');
        }
    }

    public static function trasMantenimiento(Mantenimiento $mantenimiento)
    {
        $extintor = $mantenimiento->extintor;

        if ($extintor) {
            self::cambiarA($extintor, 'Disponible');
        }
    }
}
