<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    protected $table = 'ubicaciones';
    protected $primaryKey = 'ubicacion_id';

    protected $fillable = ['piso_id', 'tipo_area', 'nombre', 'posicion'];

    protected $casts = [
        'posicion' => 'array',
    ];

    public function piso()
    {
        return $this->belongsTo(Piso::class, 'piso_id');
    }

    public function extintores()
    {
        return $this->hasMany(Extintor::class, 'ubicacion_id');
    }

    public function capacitaciones()
    {
        return $this->hasMany(Capacitacion::class, 'ubicacion_id');
    }
}
