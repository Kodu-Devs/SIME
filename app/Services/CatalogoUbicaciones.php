<?php

namespace App\Services;

use App\Models\Instalacion;
use Illuminate\Database\Eloquent\Collection;

class CatalogoUbicaciones
{
    /**
     * Retorna la jerarquía completa de Instalaciones -> Pisos -> Ubicaciones.
     * Filtra estrictamente los campos 'id' y 'nombre' para aligerar el payload de los combos.
     * Las llaves foráneas (instalacion_id, piso_id) se incluyen obligatoriamente 
     * para que Eloquent pueda armar las relaciones anidadas en memoria.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function arbol(): Collection
    {
        return Instalacion::select('id', 'nombre')
            ->with(['pisos' => function ($query) {
                $query->select('id', 'instalacion_id', 'nombre')
                    ->with(['ubicaciones' => function ($q) {
                        $q->select('id', 'piso_id', 'nombre');
                    }]);
            }])
            ->get();
    }
}
