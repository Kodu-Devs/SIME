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
        $instalacionesCache = Instalacion::all();
        $pisosCache = Piso::all();

        // Validación inicial para no hacer nada si las tablas previas están vacías
        if ($instalacionesCache->isEmpty() || $pisosCache->isEmpty()) {
            $this->command->warn('Saltando UbicacionSeeder: Faltan instalaciones o pisos. Corre los seeders anteriores primero.');
            return;
        }

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
            
            // Buscamos en la colección (sin consultar a la BD en cada vuelta)
            $inst = $instalacionesCache->firstWhere('nombre', $nombreInst);
            if (!$inst) {
                $this->command->warn("Instalación no encontrada: {$nombreInst}. Se omite.");
                continue;
            }

            // Buscamos el piso que pertenezca a la instalación encontrada
            $piso = $pisosCache->where('instalacion_id', $inst->id)
                               ->firstWhere('nombre', $nombrePiso);
            if (!$piso) {
                $this->command->warn("Piso no encontrado: {$nombreInst} / {$nombrePiso}. Se omite.");
                continue;
            }

            Ubicacion::updateOrCreate(
                ['piso_id' => $piso->id, 'nombre' => $nombre],
                ['tipo_area' => $tipoArea, 'posicion' => null]
            );
        }
        
        $this->command->info('Ubicaciones sembradas con éxito y de forma optimizada.');
    }
}