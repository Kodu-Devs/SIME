<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('extintores', function (Blueprint $table) {
            $table->id();

            $table->string('etiqueta_inventario')->unique();
            $table->foreignId('tipoextintor_id')->constrained('tipo_extintor');
            $table->foreignId('ubicacion_id')->constrained('ubicaciones');
            $table->string('estatus')->default('nuevo');
            $table->dateTime('fecha_instalacion');
            $table->dateTime('fecha_vencimiento');
            $table->string('capacidad');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('extintores');
    }
};
