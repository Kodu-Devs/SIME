<?php

namespace Database\Seeders;

use App\Models\Capacitacion;
use App\Models\Extintor;
use App\Models\Ubicacion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class CapacitacionSeeder extends Seeder
{
    public function run(): void
    {
        // Validación FUERA del ciclo: se pregunta una sola vez.
        if (Ubicacion::count() === 0) {
            $this->command->warn('Saltando CapacitacionSeeder: No hay ubicaciones. Corre primero UbicacionSeeder.');

            return;
        }

        // Ubicaciones ordenadas por id: se asignan por posición, sin azar.
        $ubicaciones = Ubicacion::orderBy('id')->get();

        // Solo extintores en 'Medio uso', los únicos que el formulario permite apartar.
        $extintoresApartables = Extintor::where('estatus', 'Medio uso')->orderBy('id')->pluck('id');

        $capacitaciones = [
            ['Uso y manejo de extintores',       '2026-03-10 09:00:00'],
            ['Brigada de primeros auxilios',     '2026-04-15 10:30:00'],
            ['Simulacro de evacuación',          '2026-05-20 11:00:00'],
            ['Prevención de incendios',          '2026-08-12 09:30:00'],
            ['Actualización de brigadas',        '2026-11-05 10:00:00'],
            ['Capacitación para nuevo personal', '2026-12-02 12:00:00'],
        ];

        foreach ($capacitaciones as $i => [$nombre, $fechaHora]) {
            // 1.ª capacitación → 1.ª ubicación, 2.ª → 2.ª, etc.
            $ubicacion = $ubicaciones->get($i % $ubicaciones->count());

            // firstOrCreate: si la capacitación ya existe, NO le cambia la ubicación
            // withTrashed: con SoftDeletes, firstOrCreate no ve las capacitaciones
            // dadas de baja y crearia un duplicado; asi la baja se respeta y no se repite
            $capacitacion = Capacitacion::withTrashed()->firstOrCreate(
                ['nombre' => $nombre, 'fecha_hora' => $fechaHora],
                ['ubicacion_id' => $ubicacion->id]
            );

            $this->apartarExtintores($capacitacion, $extintoresApartables, $i);
        }

        $this->command->info('Capacitaciones sembradas con éxito.');
    }

    /**
     * Aparta hasta 2 extintores por capacitación, por posición y sin azar.
     * syncWithoutDetaching evita duplicar filas si el seeder se corre de nuevo.
     *
     * @param  Collection<int, int>  $extintoresApartables
     */
    private function apartarExtintores(Capacitacion $capacitacion, Collection $extintoresApartables, int $posicion): void
    {
        if ($capacitacion->trashed() || $extintoresApartables->isEmpty()) {
            return;
        }

        $total = $extintoresApartables->count();
        $ids = collect([$posicion % $total, ($posicion + 1) % $total])
            ->unique()
            ->map(fn (int $indice) => $extintoresApartables[$indice]);

        $capacitacion->extintores()->syncWithoutDetaching($ids->all());
    }
}
