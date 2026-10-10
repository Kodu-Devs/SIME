<?php

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
use Illuminate\Database\Eloquent\Attributes\RouteKey;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::resource('alertas',alertaController::class);
Route::resource('capacitaciones',capacitacionController::class);
Route::resource('eventos-uso',eventoUsoController::class);
Route::resource('extintores',extintorController::class);
Route::resource('instalaciones',instalacionController::class);
Route::resource('mantenimientos',mantenimientoController::class);
Route::resource('pisos',pisoController::class);
Route::resource('tipos-extintor',tipoExtintorController::class);
Route::resource('ubicaciones',ubicacionController::class);
Route::resource('usuarios',userController::class);