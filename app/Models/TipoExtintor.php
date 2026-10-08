<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TipoExtintor extends Model
{
    use HasFactory;

    // Define la tabla exacta
    protected $table = 'tipo_extintor';

    // Define la llave primaria personalizada
    protected $primaryKey = 'tipoextintor_id';

    // Permite la asignación masiva para estos campos
    protected $fillable = [
        'nombre',
        'agente_extintor',
        'clase_fuego',
        'unidad',
    ];

    // Relación de uno a muchos
    public function extintores()
    {
        return $this->hasMany(Extintor::class, 'tipoextintor_id');
    }
}
