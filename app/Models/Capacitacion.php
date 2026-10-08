<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capacitacion extends Model
{
    protected $table = 'capacitaciones';

    protected $fillable = ['nombre', 'fecha_hora', 'ubicacion_id'];

    protected $casts = [
        'fecha_hora' => 'datetime',
    ];

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'ubicacion_id');
    }

    public function eventosUso()
    {
        return $this->hasMany(EventoUso::class, 'capacitacion_id');
    }
}
