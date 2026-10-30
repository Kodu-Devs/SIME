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
            // Regla: No mover fecha si el extintor está en Baja.
            if ($extintor->estatus !== 'Baja') {
                // Regla: Solo avanzar vencimiento si es Revisión o Relleno.
                if (in_array($mantenimiento->tipo_mantenimiento, ['Revisión', 'Relleno de contenido'])) {
                    $extintor->fecha_vencimiento = Extintor::calcularVencimiento($extintor->fecha_instalacion, 1);
                    $extintor->save();
                }
            }

            self::cambiarA($extintor, 'Disponible');
        }
    }
}
