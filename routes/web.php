<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\ExtintorController;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\HistorialController;
use App\Http\Controllers\AlertaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ==========================================
// RUTAS PÚBLICAS (Solo Lectura)
// ==========================================

// El mapa es la página de inicio por defecto
Route::get('/', [MapaController::class, 'index'])->name('mapa.index');

Route::prefix('mapa')->name('mapa.')->group(function () {
    Route::get('/{instalacion}', [MapaController::class, 'edificio'])->name('edificio');
    Route::get('/{instalacion}/{piso}', [MapaController::class, 'piso'])->name('piso');
});

// Módulo 3: Extintores (Lectura)
Route::get('/extintores', [ExtintorController::class, 'index'])->name('extintores.index');

// Módulos 4 y 5: Agenda e Historial (Lectura)
Route::get('/agenda', [AgendaController::class, 'index'])->name('agenda.index');
Route::get('/historial', [HistorialController::class, 'index'])->name('historial.index');


// ==========================================
// RUTAS ADMINISTRATIVAS (Protegidas)
// ==========================================
Route::middleware(['auth', 'verified'])->group(function () {

    // El Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Módulo 2: Mapa interactivo (Escritura)
    Route::put('/mapa/ubicacion/{ubicacion}/posicion', [MapaController::class, 'updatePosicion'])->name('mapa.ubicacion.posicion');

    // Módulo 3: Extintores (Escritura y baja)
    Route::post('/extintores', [ExtintorController::class, 'store'])->name('extintores.store');
    Route::put('/extintores/{extintor}', [ExtintorController::class, 'update'])->name('extintores.update');
    Route::patch('/extintores/{extintor}/baja', [ExtintorController::class, 'baja'])->name('extintores.baja');

   // Módulo 4: Agenda (Escritura)
    Route::prefix('agenda')->name('agenda.')->group(function () {
        // Mantenimientos
        Route::post('/mantenimientos', [AgendaController::class, 'storeMantenimiento'])->name('mantenimientos.store');
        Route::put('/mantenimientos/{mantenimiento}', [AgendaController::class, 'updateMantenimiento'])->name('mantenimientos.update');
        Route::patch('/mantenimientos/{mantenimiento}/realizarMantenimiento', [AgendaController::class, 'realizarMantenimiento'])->name('mantenimientos.realizarMantenimiento');
        Route::delete('/mantenimientos/{mantenimiento}', [AgendaController::class, 'destroyMantenimiento'])->name('mantenimientos.destroy');

        // Capacitaciones
        Route::post('/capacitaciones', [AgendaController::class, 'storeCapacitacion'])->name('capacitaciones.store');
        Route::put('/capacitaciones/{capacitacion}', [AgendaController::class, 'updateCapacitacion'])->name('capacitaciones.update');
        Route::delete('/capacitaciones/{capacitacion}', [AgendaController::class, 'destroyCapacitacion'])->name('capacitaciones.destroy');
    });

    // Módulo 5: Historial (Escritura)
    Route::post('/historial/usos', [HistorialController::class, 'storeUso'])->name('historial.usos.store');
    Route::get('/historial/exportar', [HistorialController::class, 'exportar'])->name('historial.exportar');

    // Alertas
    Route::prefix('alertas')->name('alertas.')->group(function () {
        Route::get('/', [AlertaController::class, 'index'])->name('index');
        Route::patch('/leer-todas', [AlertaController::class, 'leerTodas'])->name('leerTodas');
        Route::patch('/{alerta}/leer', [AlertaController::class, 'leer'])->name('leer');
    });

    // Rutas de Perfil (Generadas por Breeze) 
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

require __DIR__ . '/auth.php';