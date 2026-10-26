<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1) Columnas nuevas: nullable y con llave foránea
        Schema::table('alertas', function (Blueprint $table) {
            $table->foreignId('mantenimiento_id')
                ->nullable()
                ->constrained('mantenimientos');

            $table->foreignId('capacitacion_id')
                ->nullable()
                ->constrained('capacitaciones');
        });

        // 2) extintor_id pasa a nullable (conserva su llave foránea).
        //    Aparte, para no mezclar cambios en la misma operación.
        Schema::table('alertas', function (Blueprint $table) {
            $table->foreignId('extintor_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Orden inverso: primero extintor_id vuelve a obligatorio
        Schema::table('alertas', function (Blueprint $table) {
            $table->foreignId('extintor_id')->nullable(false)->change();
        });

        // Después se quitan las dos columnas junto con su llave foránea
        Schema::table('alertas', function (Blueprint $table) {
            $table->dropConstrainedForeignId('capacitacion_id');
            $table->dropConstrainedForeignId('mantenimiento_id');
        });
    }
};