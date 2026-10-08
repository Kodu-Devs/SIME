<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Alerta extends Model
{
    use HasFactory;

    protected $table = 'alertas';

    protected $fillable = [
        'extintor_id',
        'usuario_id',
        'tipo',
        'mensaje',
        'fecha_generada',
        'leida'
    ];

    // Casteamos los tipos de datos especiales
    protected $casts = [
        'leida' => 'boolean',
        'fecha_generada' => 'datetime',
    ];

    // Relaciones
    public function extintor()
    {
        return $this->belongsTo(Extintor::class, 'extintor_id', 'extintor_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id', 'usuario_id');
    }

    // Local Scope para filtrar alertas no leídas (Tu extra)
    public function scopeNoLeidas(Builder $query)
    {
        return $query->where('leida', false);
    }
}
