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
        $ultima = self::FILA_TABLA + count($this->datos['filas']);

        // Filtros en los encabezados (se puede filtrar por tipo de motivo) y fila fija.
        $sheet->setAutoFilter('A' . self::FILA_TABLA . ':I' . $ultima);

        return [
            1 => ['font' => ['bold' => true, 'size' => 14]],
            'A2:A5' => ['font' => ['bold' => true]],
            7 => ['font' => ['bold' => true]],
            self::FILA_TABLA => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '444444']],
            ],
        ];
    }
}