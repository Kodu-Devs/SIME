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
    Schema::create('usuarios', function (Blueprint $table) {
        $table->id('usuario_id'); 
        $table->string('nombre');
        $table->string('email')->unique();
        $table->string('password_hash'); 
        $table->rememberToken();
        $table->timestamps();
        $table->softDeletes(); 
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios_tables');
    }
};
