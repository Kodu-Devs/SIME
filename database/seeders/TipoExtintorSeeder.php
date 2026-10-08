<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TipoExtintor;

class TipoExtintorSeeder extends Seeder
{
    public function run(): void
    {
        // Insertamos los 4 tipos solicitados: PQS, CO2, Agua y Clase K[cite: 3]
        $tipos = [
            ['nombre' => 'PQS', 'agente_extintor' => 'Polvo Químico Seco', 'clase_fuego' => 'A,B,C', 'unidad' => 'kg'],
            ['nombre' => 'CO2', 'agente_extintor' => 'Dióxido de Carbono', 'clase_fuego' => 'B,C', 'unidad' => 'kg'],
            ['nombre' => 'Agua', 'agente_extintor' => 'Agua a presión', 'clase_fuego' => 'A', 'unidad' => 'l'],
            ['nombre' => 'Clase K', 'agente_extintor' => 'Acetato de Potasio', 'clase_fuego' => 'K', 'unidad' => 'l'],
        ];

        foreach ($tipos as $tipo) {
            TipoExtintor::create($tipo);
        }
    }
}
