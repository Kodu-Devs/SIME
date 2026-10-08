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
        Schema::create('alertas', function (Blueprint $table) {
            $table->id('alerta_id'); // Llave primaria
            
            // Llaves foráneas. Asumimos que las tablas extintores y usuarios tienen como llave primaria extintor_id y usuario_id.
            $table->foreignId('extintor_id')->references('extintor_id')->on('extintores');[cite: 3]
            $table->foreignId('usuario_id')->references('usuario_id')->on('usuarios');[cite: 3]
            
            $table->string('tipo');[cite: 3]
            $table->string('mensaje');[cite: 3]
            $table->dateTime('fecha_generada');[cite: 3]
            $table->boolean('leida')->default(false); // Default false para las no leídas
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alertas');
    }
};
