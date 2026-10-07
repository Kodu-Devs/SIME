<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Usuario extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $table = 'usuarios';
    protected $primaryKey = 'usuario_id';

    protected $fillable = [
        'nombre',
        'email',
        'password_hash',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $casts = [
        'password_hash' => 'hashed',
    ];

    // Relaciones
    public function alertas()
    {
        return $this->hasMany(Alerta::class, 'usuario_id');
    }

    public function eventosUso()
    {
        return $this->hasMany(EventoUso::class, 'usuario_id');
    }

    // Método extra para que Laravel sepa dónde está la contraseña
    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
