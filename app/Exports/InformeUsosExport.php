<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;

class InformeUsosExport implements FromArray, WithTitle, ShouldAutoSize, WithStyles, WithStrictNullComparison
{    // Fila donde empieza la tabla (encabezados de columnas).
    private const FILA_TABLA = 10;

    private const COLUMNAS = [
        'Fecha', 'Hora', 'Extintor', 'Tipo', 'Edificio / Área',
        'Ubicación', 'Tipo de descarga', 'Tipo de motivo', 'Descripción',
    ];

    public function __construct(private array $datos)
    {
    }

    public function array(): array
    {
        $e = $this->datos['encabezado'];
        $r = $this->datos['resumen'];

        $filas = [
            ['Informe de eventos de uso'],
            ['Periodo', $e['periodo']],
            ['Área', $e['area']],
            ['Folio', $e['folio']],
            ['Generado', $e['generado']],
            [''],
            ['Eventos', 'Uso total', 'Uso parcial', 'Extintores involucrados'],
            [$r['eventos'], $r['total'], $r['parcial'], $r['extintores']],
            [''],
            self::COLUMNAS,
        ];

        foreach ($this->datos['filas'] as $f) {
            $filas[] = [
                $f['fecha'], $f['hora'], $f['extintor'], $f['tipo'], $f['edificio'],
                $f['ubicacion'], $f['tipo_descarga'], $f['tipo_motivo'], $f['descripcion'],
            ];
        }

        if (empty($this->datos['filas'])) {
            $filas[] = ['Sin eventos de uso en el periodo seleccionado.'];
        }

        return $filas;
    }

    public function title(): string
    {
        return 'Eventos de uso';
    }

        public function styles(Worksheet $sheet): array
    {
        $total = count($this->datos['filas']);
        $ultima = self::FILA_TABLA + $total;

        // Filtros en los encabezados (se puede filtrar por tipo de motivo).
        $sheet->setAutoFilter('A' . self::FILA_TABLA . ':I' . $ultima);

        $estilos = [
            1 => ['font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'C0262D']]],
            'A2:A5' => ['font' => ['bold' => true, 'color' => ['rgb' => '6D6162']]],
            'A7:D7' => [
                'font' => ['bold' => true],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'FDEDED']],
            ],
            'A8:D8' => ['alignment' => ['horizontal' => 'left']],
            'A' . self::FILA_TABLA . ':I' . self::FILA_TABLA => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '272222']],
            ],
        ];

        // Líneas finas en las filas de datos (si las hay).
        if ($total > 0) {
            $estilos['A' . (self::FILA_TABLA + 1) . ':I' . $ultima] = [
                'borders' => ['allBorders' => ['borderStyle' => 'thin', 'color' => ['rgb' => 'D7D4D4']]],
            ];
        }

        return $estilos;
    }
}