<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\alertaController;
use App\Http\Controllers\capacitacionController;
use App\Http\Controllers\eventoUsoController;
use App\Http\Controllers\extintorController;
use App\Http\Controllers\instalacionController;
use App\Http\Controllers\mantenimientoController;
use App\Http\Controllers\pisoController;
use App\Http\Controllers\tipoExtintorController;
use App\Http\Controllers\ubicacionController;
use App\Http\Controllers\userController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('alertas', alertaController::class);
    Route::resource('capacitaciones', capacitacionController::class);
    Route::resource('eventos-uso', eventoUsoController::class);
    Route::resource('extintores', extintorController::class);
    Route::resource('instalaciones', instalacionController::class);
    Route::resource('mantenimientos', mantenimientoController::class);
    Route::resource('pisos', pisoController::class);
    Route::resource('tipos-extintor', tipoExtintorController::class);
    Route::resource('ubicaciones', ubicacionController::class);
    Route::resource('usuarios', userController::class);
});

require __DIR__ . '/auth.php';
