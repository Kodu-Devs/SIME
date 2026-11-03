<?php

namespace Database\Seeders;

use App\Models\Alerta;
use App\Models\Capacitacion;
use App\Models\Extintor;
use App\Models\Mantenimiento;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class EstresAlertaSeeder extends Seeder
{
    /**
     * Cantidad de alertas ESTRES- a generar.
     */
    public const CANTIDAD = 3000;

    /**
     * Cuántas alertas se insertan por lote.
     */
    private const LOTE = 500;

    public function run(): void
    {
        $usuarios = User::pluck('id');

        if ($usuarios->isEmpty()) {
            $this->command->warn('EstresAlertaSeeder omitido: no hay usuarios.');

            return;
        }

        $hoy = today()->toDateString();
        $limite = today()->addDays(7)->toDateString();

        // Extintores agrupados por el escenario que justifica cada categoría.
        $vencidos = Extintor::where('estatus', '!=', 'Baja')
            ->whereDate('fecha_vencimiento', '<', $hoy)
            ->pluck('etiqueta_inventario', 'id');
        $porVencer = Extintor::where('estatus', '!=', 'Baja')
            ->whereBetween('fecha_vencimiento', [$hoy, $limite])
            ->pluck('etiqueta_inventario', 'id');
        $conEstatus = Extintor::whereIn('estatus', ['Vacío', 'Fuera de servicio'])
            ->pluck('etiqueta_inventario', 'id');
        $cualquiera = Extintor::pluck('etiqueta_inventario', 'id');

        // withTrashed: la alerta sigue resolviendo su origen aunque tenga baja lógica.
        $mantenimientos = Mantenimiento::withTrashed()->pluck('id');
        $capacitaciones = Capacitacion::withTrashed()->pluck('id');

        // Solo se generan categorías que tengan un origen real al cual apuntar.
        $categorias = [];

        if ($cualquiera->isNotEmpty()) {
            array_push($categorias, 'vencido', 'por_vencer', 'estatus');
        } else {
            $this->command->warn('Sin extintores: se omiten alertas vencido, por_vencer y estatus.');
        }

        if ($mantenimientos->isNotEmpty()) {
            $categorias[] = 'mantenimiento';
        } else {
            $this->command->warn('Sin mantenimientos: se omiten alertas de mantenimiento.');
        }

        if ($capacitaciones->isNotEmpty()) {
            $categorias[] = 'capacitacion';
        } else {
            $this->command->warn('Sin capacitaciones: se omiten alertas de capacitación.');
        }

        if ($categorias === []) {
            $this->command->warn('EstresAlertaSeeder omitido: no hay ningún origen para las alertas.');

            return;
        }

        $lote = [];
        $total = 0;

        for ($i = 0; $i < self::CANTIDAD; $i++) {
            // Reparte parejo todas las categorías para que salgan todas.
            $categoria = $categorias[$i % count($categorias)];

            $alerta = Alerta::factory()
                ->{$this->estadoDe($categoria)}(...$this->origenDe(
                    $categoria,
                    $vencidos,
                    $porVencer,
                    $conEstatus,
                    $cualquiera,
                    $mantenimientos,
                    $capacitaciones,
                ))
                ->state(fn (): array => [
                    'user_id' => $usuarios->random(),
                    'leida' => fake()->boolean(45),
                ])
                ->make();

            $atributos = $alerta->getAttributes();
            $atributos['fecha_generada'] = $alerta->fecha_generada->toDateTimeString();
            $atributos['leida'] = (int) $atributos['leida'];
            $atributos['created_at'] = $atributos['updated_at'] = now()->toDateTimeString();
            $lote[] = $atributos;

            if (count($lote) === self::LOTE) {
                Alerta::insert($lote);
                $total += count($lote);
                $lote = [];
            }
        }

        if ($lote !== []) {
            Alerta::insert($lote);
            $total += count($lote);
        }

        $this->command->info("EstresAlertaSeeder: {$total} alertas ESTRES- creadas.");
    }

    /**
     * Nombre del state de la factory que corresponde a la categoría.
     */
    private function estadoDe(string $categoria): string
    {
        return match ($categoria) {
            'por_vencer' => 'porVencer',
            default => $categoria,
        };
    }

    /**
     * Argumentos (id del origen y etiqueta) para el state de la categoría.
     * Prefiere un extintor que realmente cumpla el escenario y, si no hay,
     * usa cualquiera para no dejar la categoría vacía.
     *
     * @param  Collection<int, string>  $vencidos
     * @param  Collection<int, string>  $porVencer
     * @param  Collection<int, string>  $conEstatus
     * @param  Collection<int, string>  $cualquiera
     * @param  Collection<int, int>  $mantenimientos
     * @param  Collection<int, int>  $capacitaciones
     * @return array<int, int|string>
     */
    private function origenDe(
        string $categoria,
        Collection $vencidos,
        Collection $porVencer,
        Collection $conEstatus,
        Collection $cualquiera,
        Collection $mantenimientos,
        Collection $capacitaciones,
    ): array {
        if ($categoria === 'mantenimiento') {
            return [$mantenimientos->random()];
        }

        if ($categoria === 'capacitacion') {
            return [$capacitaciones->random()];
        }

        $pool = match ($categoria) {
            'vencido' => $vencidos,
            'por_vencer' => $porVencer,
            default => $conEstatus,
        };

        if ($pool->isEmpty()) {
            $pool = $cualquiera;
        }

        $id = $pool->keys()->random();

        return [$id, (string) $pool[$id]];
    }
}
