<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\ExtintorController;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\HistorialController;
use App\Http\Controllers\AlertaController;
use App\Http\Controllers\ConsultaPublicaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==========================================
// RUTAS PÚBLICAS (ConsultaPublicaController)
// ==========================================
// Cambiamos la vista de bienvenida por defecto al mapa público
Route::get('/', [ConsultaPublicaController::class, 'mapa'])->name('publico.mapa');
Route::get('/agenda-publica', [ConsultaPublicaController::class, 'agenda'])->name('publico.agenda');
Route::get('/historial-publico', [ConsultaPublicaController::class, 'historial'])->name('publico.historial');


// ==========================================
// RUTAS ADMINISTRATIVAS (Protegidas)
// ==========================================
Route::middleware(['auth', 'verified'])->group(function () {

    // El Dashboard (Sobreescribimos la ruta por defecto de Breeze)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Mapa interactivo exclusivo del administrador
    Route::get('/mapa-admin', [MapaController::class, 'index'])->name('mapa.admin');
    Route::put('/mapa-admin/ubicacion/{ubicacion}/posicion', [MapaController::class, 'updatePosicion'])->name('mapa.ubicacion.posicion');

    // Recursos Completos (CRUDs que usarán vistas Maestro-Detalle)
    Route::resource('extintores', ExtintorController::class);
    Route::resource('agenda', AgendaController::class);
    Route::resource('historial', HistorialController::class);

    // Alertas (Solo lectura/actualización para el modal, sin resource completo)
    Route::get('/alertas', [AlertaController::class, 'index'])->name('alertas.index');
    Route::post('/alertas/{alerta}/leer', [AlertaController::class, 'marcarLeida'])->name('alertas.leer');

    // Rutas de Perfil (Generadas por Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
