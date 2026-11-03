<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class InformeExtintoresExport implements FromArray, WithTitle, ShouldAutoSize, WithStyles
{
    private const COLUMNAS = [
        'ID', 'Tipo', 'Capacidad', 'Edificio / Área', 'Piso',
        'Ubicación', 'Estatus', 'Último mantenimiento', 'Próxima revisión',
    ];

    // Fila donde empieza la tabla principal (encabezados de columnas).
    private int $filaTabla;

    public function __construct(private array $datos)
    {
        // 13 filas fijas arriba + una por cada tipo de extintor.
        $this->filaTabla = 13 + count($datos['por_tipo']);
    }

    public function array(): array
    {
        $e = $this->datos['encabezado'];
        $r = $this->datos['resumen'];

        $filas = [
            ['Lista de extintores'],
            [$e['inventario']],
            ['Área', $e['area']],
            ['Folio', $e['folio']],
            ['Generado', $e['generado']],
            [''],
            array_merge(['Total'], array_keys($r['por_estatus'])),
            array_merge([$r['total']], array_values($r['por_estatus'])),
            [''],
            ['Extintores por tipo'],
            ['Tipo', 'Clase de fuego', 'Cantidad'],
        ];

        foreach ($this->datos['por_tipo'] as $t) {
            $filas[] = [$t['tipo'], $t['clase_fuego'], $t['cantidad']];
        }

        $filas[] = [''];
        $filas[] = self::COLUMNAS;

        foreach ($this->datos['filas'] as $f) {
            $filas[] = [
                $f['id'], $f['tipo'], $f['capacidad'], $f['edificio'], $f['piso'],
                $f['ubicacion'], $f['estatus'], $f['ultimo_mantenimiento'], $f['proxima_revision'],
            ];
        }

        if (empty($this->datos['filas'])) {
            $filas[] = ['Sin extintores en el inventario con los filtros seleccionados.'];
        }

        return $filas;
    }

    public function title(): string
    {
        return 'Lista de extintores';
    }

    public function styles(Worksheet $sheet): array
    {
        $ultima = $this->filaTabla + count($this->datos['filas']);

        // Filtros en los encabezados de la tabla principal.
        $sheet->setAutoFilter('A' . $this->filaTabla . ':I' . $ultima);

        return [
            1 => ['font' => ['bold' => true, 'size' => 14]],
            'A2:A5' => ['font' => ['bold' => true]],
            7 => ['font' => ['bold' => true]],
            10 => ['font' => ['bold' => true]],
            11 => ['font' => ['bold' => true]],
            $this->filaTabla => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '444444']],
            ],
        ];
    }
}