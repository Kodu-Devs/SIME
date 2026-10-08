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
            $table->foreignId('extintor_id')->references('extintor_id')->on('extintores');
            $table->foreignId('usuario_id')->references('usuario_id')->on('usuarios');
            
            $table->string('tipo');
            $table->string('mensaje');
            $table->dateTime('fecha_generada');
            $table->boolean('leida')->default(false);
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
