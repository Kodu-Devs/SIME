<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Se renombra a 'name' porque el frontend (registro, perfil, menu) y los
     * tests ya envian y leen 'name', igual que el resto del ecosistema de Laravel.
     * Se usa una migracion nueva para no reescribir el historial ya aplicado.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('nombre', 'name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('name', 'nombre');
        });
    }
};
