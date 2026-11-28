<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

test('un administrador autenticado puede entrar al centro de ayuda', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('ayuda.administrador'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Ayuda/Administrador')
        );
});

test('un visitante sin sesión es redirigido al login al intentar entrar a la ayuda del administrador', function () {
    $this->get(route('ayuda.administrador'))
        ->assertRedirect(route('login'));
});

test('un visitante sin sesión puede consultar la guía de ayuda pública', function () {
    $this->get(route('ayuda.usuario'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Ayuda/Usuario')
        );
});

test('un administrador autenticado también puede abrir la guía de consulta pública', function () {
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('ayuda.usuario'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Ayuda/Usuario')
        );
});
