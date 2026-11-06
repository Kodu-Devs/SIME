<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ubicaciones', function (Blueprint $table) {
            $table->string('nombre', 255)->change();
        });

        Schema::table('mantenimientos', function (Blueprint $table) {
            $table->index('fecha_programada');
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE extintores ADD CONSTRAINT chk_extintores_fechas CHECK (fecha_vencimiento > fecha_instalacion)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE extintores DROP CONSTRAINT chk_extintores_fechas');
        }

        Schema::table('mantenimientos', function (Blueprint $table) {
            $table->dropIndex(['fecha_programada']);
        });

        Schema::table('ubicaciones', function (Blueprint $table) {
            $table->text('nombre')->change();
        });
    }
};
