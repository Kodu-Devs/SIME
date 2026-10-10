<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instalacion extends Model
{
    protected $table = 'instalaciones';

    protected $fillable = ['nombre', 'tipo'];

    protected $casts = [];

    public function pisos()
    {
        return $this->hasMany(Piso::class, 'instalacion_id');
    }
}