<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mantenimiento extends Model
{
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

    public function scopePendientes($query)
    {
        return $query->whereNull('fecha_realizada');
    }

    public function scopeRealizados($query)
    {
        return $query->whereNotNull('fecha_realizada');
    }
}
