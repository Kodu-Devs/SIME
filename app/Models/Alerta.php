<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Alerta extends Model
{
    use HasFactory;

    // Categorías oficiales: de qué trata la alerta (tipo dice qué tan grave es)
    public const CATEGORIAS = ['vencido', 'por_vencer', 'estatus', 'mantenimiento', 'capacitacion'];

    protected $table = 'alertas';

    protected $fillable = [
        'extintor_id',
        'mantenimiento_id',
        'capacitacion_id',
        'user_id',
        'tipo',
        'categoria',
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
        return $this->belongsTo(Extintor::class);
    }

    // withTrashed(): mantenimientos y capacitaciones tienen baja lógica,
    // y la alerta debe seguir resolviendo su origen aunque se den de baja.
    public function mantenimiento()
    {
        return $this->belongsTo(Mantenimiento::class, 'mantenimiento_id')->withTrashed();
    }

    public function capacitacion()
    {
        return $this->belongsTo(Capacitacion::class, 'capacitacion_id')->withTrashed();
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Local Scope para filtrar alertas no leídas
    public function scopeNoLeidas(Builder $query)
    {
        return $query->where('leida', false);
    }
}
