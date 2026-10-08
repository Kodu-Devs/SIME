<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('pisos', function (Blueprint $table) {
        $table->id();
        $table->foreignId('instalacion_id')->constrained('instalaciones', 'instalacion_id');
        $table->string('nombre');
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('pisos');
}
};
