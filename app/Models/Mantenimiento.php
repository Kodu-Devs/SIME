<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mantenimiento extends Model
{
    // Habilitar fábricas y baja lógica para conservar el historial
    use HasFactory, SoftDeletes;

    protected $table = 'mantenimientos';

    protected $fillable = ['extintor_id', 'tipo', 'descripcion', 'fecha_programada', 'fecha_realizada'];

    protected $casts = [
        'fecha_programada' => 'datetime',
        'fecha_realizada' => 'datetime',
    ];

    public function extintor()
    {
        return $this->belongsTo(Extintor::class, 'extintor_id');
    }

    public function alertas()
    {
        return $this->hasMany(Alerta::class, 'mantenimiento_id');
    }

    public function scopePendientes($query)
    {
        return $query->whereNull('fecha_realizada');
    }

    public function scopeRealizados($query)
    {
        return $query->whereNotNull('fecha_realizada');
    }
}