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

        // [instalación, piso, nombre, tipo_area]
        // Solo zonas donde puede haber extintores (sin salones ni baños).
        // Los nombres deben coincidir EXACTO con los de los planos.
        $ubicaciones = [
            // Edificio A
            ['Edificio A', 'Planta baja', 'Escaleras', 'Escaleras'],
            ['Edificio A', 'Planta baja', 'Oficina de cómputo', 'Oficina'],
            ['Edificio A', 'Planta baja', 'Oficina', 'Oficina'],
            ['Edificio A', 'Planta baja', 'Pasillo', 'Pasillo'],
            ['Edificio A', 'Nivel 1', 'Escaleras', 'Escaleras'],
            ['Edificio A', 'Nivel 1', 'Administración', 'Oficina'],
            ['Edificio A', 'Nivel 1', 'Lab. Dibujo', 'Laboratorio'],
            ['Edificio A', 'Nivel 1', 'Oficina', 'Oficina'],
            ['Edificio A', 'Nivel 1', 'Pasillo', 'Pasillo'],

            // Edificio B
            ['Edificio B', 'Planta baja', 'Pasillo', 'Pasillo'],
            ['Edificio B', 'Planta baja', 'Escaleras', 'Escaleras'],
            ['Edificio B', 'Planta baja', 'Taller automotriz', 'Taller'],
            ['Edificio B', 'Planta baja', 'Taller de robótica', 'Taller'],
            ['Edificio B', 'Nivel 1', 'Pasillo', 'Pasillo'],
            ['Edificio B', 'Nivel 1', 'Escaleras', 'Escaleras'],
            ['Edificio B', 'Nivel 1', 'Oficina', 'Oficina'],
            ['Edificio B', 'Nivel 1', 'Lab. Redes', 'Laboratorio'],

            // Edificio C
            ['Edificio C', 'Planta baja', 'Escaleras', 'Escaleras'],
            ['Edificio C', 'Planta baja', 'Pasillo', 'Pasillo'],
            ['Edificio C', 'Planta baja', 'Lab. Programación', 'Laboratorio'],
            ['Edificio C', 'Planta baja', 'Auditorio', 'Auditorio'],
            ['Edificio C', 'Nivel 1', 'Escaleras', 'Escaleras'],
            ['Edificio C', 'Nivel 1', 'Biblioteca', 'Biblioteca'],
            ['Edificio C', 'Nivel 1', 'Pasillo', 'Pasillo'],

            // Edificio D
            ['Edificio D', 'Planta baja', 'Pasillo', 'Pasillo'],
            ['Edificio D', 'Planta baja', 'Escaleras', 'Escaleras'],
            ['Edificio D', 'Planta baja', 'Taller 1', 'Taller'],
            ['Edificio D', 'Planta baja', 'Taller 2', 'Taller'],
            ['Edificio D', 'Nivel 1', 'Pasillo', 'Pasillo'],
            ['Edificio D', 'Nivel 1', 'Escaleras', 'Escaleras'],
            ['Edificio D', 'Nivel 1', 'Oficina', 'Oficina'],

            // Edificio E
            ['Edificio E', 'Planta baja', 'Auditorio', 'Auditorio'],
            ['Edificio E', 'Planta baja', 'Biblioteca', 'Biblioteca'],
            ['Edificio E', 'Planta baja', 'Pasillo', 'Pasillo'],
            ['Edificio E', 'Planta baja', 'Oficina', 'Oficina'],
            ['Edificio E', 'Planta baja', 'Escaleras', 'Escaleras'],
            ['Edificio E', 'Nivel 1', 'Oficina', 'Oficina'],
            ['Edificio E', 'Nivel 1', 'Pasillo', 'Pasillo'],
            ['Edificio E', 'Nivel 1', 'Escaleras', 'Escaleras'],
            ['Edificio E', 'Nivel 2', 'Oficina', 'Oficina'],
            ['Edificio E', 'Nivel 2', 'Escaleras', 'Escaleras'],
            ['Edificio E', 'Nivel 3', 'Oficina', 'Oficina'],
            ['Edificio E', 'Nivel 3', 'Escaleras', 'Escaleras'],

            // Áreas
            ['Cafetería y SUM', 'Nivel único', 'Cocina', 'Cocina'],
            ['Cafetería y SUM', 'Nivel único', 'SUM', 'Sala'],
            ['Parque vehicular', 'Nivel único', 'Estacionamiento', 'Estacionamiento'],
            ['Parque vehicular', 'Nivel único', 'Sprinter', 'Vehículo'],
            ['Almacén 2', 'Nivel único', 'Cuarto de vigilancia', 'Vigilancia'],
            ['Almacén', 'Nivel único', 'Almacén general', 'Almacén'],
            ['Estacionamiento de motocicletas', 'Nivel único', 'Estacionamiento', 'Estacionamiento'],
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

            // 'posicion' NO va en el arreglo de actualización: así no se borran
            // las coordenadas que llene Frontend. Al crear queda en null
            // (la columna es nullable).
            Ubicacion::updateOrCreate(
                ['piso_id' => $piso->id, 'nombre' => $nombre],
                ['tipo_area' => $tipoArea]
            );
        }

        $this->command->info('Ubicaciones sembradas con éxito.');
    }
}
