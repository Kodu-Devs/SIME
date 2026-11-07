<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class InformeExtintoresExport implements FromArray, WithTitle, ShouldAutoSize, WithStyles, WithStrictNullComparison{
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
        $total = count($this->datos['filas']);
        $ultima = $this->filaTabla + $total;

        // Última columna de la fila de resumen: Total + un estatus por columna.
        $ultimaResumen = Coordinate::stringFromColumnIndex(1 + count($this->datos['resumen']['por_estatus']));

        // Filtros en los encabezados de la tabla principal.
        $sheet->setAutoFilter('A' . $this->filaTabla . ':I' . $ultima);

        $estilos = [
            1 => ['font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => 'C0262D']]],
            'A2:A5' => ['font' => ['bold' => true, 'color' => ['rgb' => '6D6162']]],
            "A7:{$ultimaResumen}7" => [
                'font' => ['bold' => true],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'FDEDED']],
            ],
            "A8:{$ultimaResumen}8" => ['alignment' => ['horizontal' => 'left']],
            10 => ['font' => ['bold' => true]],
            'A11:C11' => [
                'font' => ['bold' => true],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'FDEDED']],
            ],
            'A' . $this->filaTabla . ':I' . $this->filaTabla => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '272222']],
            ],
        ];

        if ($total > 0) {
            $estilos['A' . ($this->filaTabla + 1) . ':I' . $ultima] = [
                'borders' => ['allBorders' => ['borderStyle' => 'thin', 'color' => ['rgb' => 'D7D4D4']]],
            ];
        }

        return $estilos;
    }
}