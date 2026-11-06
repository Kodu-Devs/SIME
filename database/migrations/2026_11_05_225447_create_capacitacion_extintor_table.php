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
        Schema::create('capacitacion_extintor', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capacitacion_id')->constrained('capacitaciones')->cascadeOnDelete();
            $table->foreignId('extintor_id')->constrained('extintores')->restrictOnDelete();
            $table->timestamps();

            $table->unique(['capacitacion_id', 'extintor_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capacitacion_extintor');
    }
};
