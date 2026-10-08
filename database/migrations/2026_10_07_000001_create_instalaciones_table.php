<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
{
    Schema::create('instalaciones', function (Blueprint $table) {
        $table->id('instalacion_id');
        $table->string('nombre');
        $table->string('tipo');
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('instalaciones');
}
};
