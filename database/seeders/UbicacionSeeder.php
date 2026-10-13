<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Instalacion;
use App\Models\Piso;
use App\Models\Ubicacion;

class UbicacionSeeder extends Seeder
{
    public function run(): void
    {

        $ubicaciones = [
            ['Edificio A', 'Planta baja', 'Escaleras', 'Escaleras'],
            ['Edificio A', 'Planta baja', 'Oficina de cómputo', 'Oficina'],
            ['Edificio A', 'Nivel 1', 'Escaleras', 'Escaleras'],
            ['Edificio A', 'Nivel 1', 'Administración', 'Oficina'],
            ['Edificio A', 'Nivel 1', 'Lab. Dibujo', 'Laboratorio'],
            ['Edificio B', 'Planta baja', 'Pasillo', 'Pasillo'],
            ['Edificio B', 'Planta baja', 'Taller automotriz', 'Taller'],
            ['Edificio B', 'Planta baja', 'Taller de robótica', 'Taller'],
            ['Edificio B', 'Nivel 1', 'Pasillo', 'Pasillo'],
            ['Edificio B', 'Nivel 1', 'Lab. Redes', 'Laboratorio'],
            ['Edificio C', 'Planta baja', 'Escaleras', 'Escaleras'],
            ['Edificio C', 'Planta baja', 'Pasillo', 'Pasillo'],
            ['Edificio C', 'Planta baja', 'Lab. Programación', 'Laboratorio'],
            ['Edificio C', 'Planta baja', 'Auditorio', 'Auditorio'],
            ['Edificio C', 'Nivel 1', 'Escaleras', 'Escaleras'],
            ['Edificio C', 'Nivel 1', 'Biblioteca', 'Biblioteca'],
            ['Edificio E', 'Planta baja', 'Auditorio', 'Auditorio'],
            ['Cafetería y SUM', 'Nivel único', 'Cocina', 'Cocina'],
            ['Cafetería y SUM', 'Nivel único', 'SUM', 'Sala'],
            ['Parque vehicular', 'Nivel único', 'Estacionamiento', 'Estacionamiento'],
            ['Parque vehicular', 'Nivel único', 'Sprinter', 'Vehículo'],
            ['Vigilancia', 'Nivel único', 'Cuarto de vigilancia', 'Vigilancia'],
            ['Almacén', 'Nivel único', 'Almacén general', 'Almacén'],
        ];

        foreach ($ubicaciones as [$nombreInst, $nombrePiso, $nombre, $tipoArea]) {

            $inst = Instalacion::where('nombre', $nombreInst)->first();
            if (!$inst) {
                $this->command->warn("Instalación no encontrada: {$nombreInst}");
                continue;
            }


            $piso = Piso::where('instalacion_id', $inst->id)
                ->where('nombre', $nombrePiso)
                ->first();
            if (!$piso) {
                $this->command->warn("Piso no encontrado: {$nombreInst} / {$nombrePiso}");
                continue;
            }


            Ubicacion::firstOrCreate(
                ['piso_id' => $piso->id, 'nombre' => $nombre],
                ['tipo_area' => $tipoArea, 'posicion' => null]
            );
        }
    }
}
