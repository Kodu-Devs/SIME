<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('evento_uso', function (Blueprint $table) {
            $table->id(); // Llave primaria asignada
            $table->foreignId('extintor_id')->constrained('extintores');
            $table->foreignId('usuario_id')->constrained('usuarios');
            $table->dateTime('fecha');
            $table->string('motivo');
        
            // Requerimiento: ->nullable() debe ir antes de ->constrained()
            $table->foreignId('capacitacion_id')
                ->nullable()
                ->constrained('capacitaciones');
              
            $table->string('tipo_descarga'); // total o parcial
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evento_usos');
    }
};
