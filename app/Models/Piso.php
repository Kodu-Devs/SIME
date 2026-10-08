<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Piso extends Model
{
    protected $table = 'pisos';
    protected $primaryKey = 'piso_id';

    protected $fillable = ['instalacion_id', 'nombre'];

    protected $casts = [];

    public function instalacion()
    {
        return $this->belongsTo(Instalacion::class, 'instalacion_id');
    }

    public function ubicaciones()
    {
        return $this->hasMany(Ubicacion::class, 'piso_id');
    }
}