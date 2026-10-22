<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Capacitacion extends Model
{
    // Baja logica para no perder los eventos de uso ligados a la capacitacion
    use SoftDeletes;

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
