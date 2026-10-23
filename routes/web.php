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

// Módulo 8: Consulta Pública (Valeria)
Route::get('/como-usar-extintor', function () {
    return Inertia::render('Publico/ComoUsarExtintor');
})->name('publico.como-usar');

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
    Route::post('/agenda/mantenimientos', [AgendaController::class, 'storeMantenimiento'])->name('agenda.mantenimientos.store');
    Route::put('/agenda/mantenimientos/{mantenimiento}', [AgendaController::class, 'updateMantenimiento'])->name('agenda.mantenimientos.update');
    Route::patch('/agenda/mantenimientos/{mantenimiento}/realizar', [AgendaController::class, 'realizar'])->name('agenda.mantenimientos.realizar');
    Route::delete('/agenda/mantenimientos/{mantenimiento}', [AgendaController::class, 'destroyMantenimiento'])->name('agenda.mantenimientos.destroy');
    // (Faltarían aquí las rutas equivalentes para capacitaciones según la guía)

    // Módulo 5: Historial (Escritura)
    Route::post('/historial/usos', [HistorialController::class, 'storeUso'])->name('historial.usos.store');
    Route::get('/historial/exportar', [HistorialController::class, 'exportar'])->name('historial.exportar');

    // Alertas 
    Route::get('/alertas', [AlertaController::class, 'index'])->name('alertas.index');
    Route::post('/alertas/{alerta}/leer', [AlertaController::class, 'marcarLeida'])->name('alertas.leer');

    // Rutas de Perfil (Generadas por Breeze) 
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

require __DIR__ . '/auth.php';