<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instalacion extends Model
{
    use HasFactory;
    protected $table = 'instalaciones';

    protected $fillable = ['nombre', 'tipo'];

    protected $casts = [];

    public function pisos()
    {
        return $this->hasMany(Piso::class, 'instalacion_id');
    }

    /**
     * Permite resolver la ruta tanto por ID numérico (/mapa/1) como por nombre (/mapa/Edificio A).
     */
    public function resolveRouteBinding($value, $field = null)
    {
        return is_numeric($value)
            ? $this->where($field ?? 'id', $value)->firstOrFail()
            : $this->where('nombre', $value)->firstOrFail();
    }
}