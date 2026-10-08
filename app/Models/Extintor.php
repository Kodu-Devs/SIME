<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Extintor extends Model
{
    use HasFactory;

    protected $table = 'extintores';
    protected $primaryKey = 'extintor_id';

    protected $fillable = [
        'etiqueta_inventario',
        'tipoextintor_id',
        'ubicacion_id',
        'estatus',
        'fecha_instalacion',
        'fecha_vencimiento',
        'capacidad',
    ];

    public function tipoExtintor()
    {
        return $this->belongsTo(TipoExtintor::class, 'tipoextintor_id');
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'ubicacion_id');
    }

    public function alertas()
    {
        return $this->hasMany(Alerta::class, 'extintor_id');
    }

    public function eventosUso()
    {
        return $this->hasMany(EventoUso::class, 'extintor_id');
    }

    public function mantenimientos()
    {
        return $this->hasMany(Mantenimiento::class, 'extintor_id');
    }


    public function scopeVencidos($query)
    {
        return $query->where('estatus', 'vencido');
    }

    public function scopePorVencer($query, $dias = 30)
    {
        return $query->whereBetween('fecha_vencimiento', [
            now(),
            now()->addDays($dias)
        ]);
    }
}
