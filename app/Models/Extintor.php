<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Extintor extends Model
{
    use HasFactory;

    public const ESTATUS = ['Disponible', 'Medio uso', 'Vacío', 'Fuera de servicio', 'Baja'];
    
    public const CAPACIDADES_KG = [
        '1 kg', '2 kg', '2.2 kg', '2.27 kg', '2.5 kg', '4.5 kg', '6 kg', '6.8 kg', '9 kg', '12 kg', '34 kg', '50 kg'
    ];
    
    public const CAPACIDADES_L = [
        '2.5 L', '6 L', '8 L', '9 L'
    ];

    protected $table = 'extintores';

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


    public function scopeVencidos(Builder $query): Builder
    {
        return $query->where('estatus', '!=', 'Baja')
            ->whereDate('fecha_vencimiento', '<', today());
    }

    public function scopePorVencer(Builder $query): Builder
    {
        return $query->where('estatus', '!=', 'Baja')
            ->whereDate('fecha_vencimiento', '>=', today())
            ->whereDate('fecha_vencimiento', '<=', today()->addDays(config('sime.dias_por_vencer')));
    }
}
