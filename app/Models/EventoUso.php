<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventoUso extends Model
{
    use HasFactory;

    protected $table = 'evento_uso';

    protected $fillable = [
        'extintor_id',
        'user_id',
        'fecha',
        'motivo',
        'capacitacion_id',
        'tipo_descarga',
    ];

    protected $casts = [
        'fecha' => 'datetime',
    ];

    // --- Relaciones ---

    public function extintor()
    {
        return $this->belongsTo(Extintor::class, 'extintor_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function capacitacion()
    {
        // withTrashed: el evento es historico y debe seguir mostrando su
        // capacitacion aunque esta se haya dado de baja
        return $this->belongsTo(Capacitacion::class, 'capacitacion_id')->withTrashed();
    }

    // --- Scope ---

    public function scopePorTipoDescarga($query, $tipo)
    {
        return $query->where('tipo_descarga', $tipo);
    }
}
