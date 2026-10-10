<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('capacitaciones', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->dateTime('fecha_hora');
            $table->foreignId('ubicacion_id')->constrained('ubicaciones');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capacitaciones');
    }
};
