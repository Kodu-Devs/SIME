<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>{{ $encabezado['folio'] }}</title>
    <style>
        @page { margin: 28px 30px 40px 30px; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 10px; color: #222; }
        h1 { font-size: 16px; margin: 0 0 6px 0; }
        table.meta td { padding: 1px 18px 1px 0; }
        table.resumen { border-collapse: collapse; margin: 12px 0; }
        table.resumen td { border: 1px solid #999; padding: 6px 16px; text-align: center; }
        table.resumen .num { font-size: 14px; font-weight: bold; }
        table.datos { width: 100%; border-collapse: collapse; }
        table.datos th { background: #444; color: #fff; padding: 5px; text-align: left; }
        table.datos td { border-bottom: 1px solid #ccc; padding: 4px 5px; vertical-align: top; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
        .vacio { text-align: center; padding: 18px; color: #666; }
        .pie { position: fixed; bottom: -24px; left: 0; right: 0; font-size: 8px; color: #666; text-align: right; }
        .pagina:after { content: counter(page); }
        table.tipos { border-collapse: collapse; margin: 4px 0 14px 0; }
        table.tipos th, table.tipos td { border: 1px solid #999; padding: 4px 14px; text-align: left; }
    </style>
</head>
<body>
    <div class="pie">{{ $encabezado['folio'] }} · Página <span class="pagina"></span></div>

    <h1>Lista de extintores</h1>
    <table class="meta">
        <tr>
            <td><strong>{{ $encabezado['inventario'] }}</strong></td>
            <td><strong>Área:</strong> {{ $encabezado['area'] }}</td>
            <td><strong>Folio:</strong> {{ $encabezado['folio'] }}</td>
            <td><strong>Generado:</strong> {{ $encabezado['generado'] }}</td>
        </tr>
    </table>

    <table class="resumen">
        <tr>
            <td><span class="num">{{ $resumen['total'] }}</span><br>Total</td>
            @foreach ($resumen['por_estatus'] as $estatus => $cantidad)
                <td><span class="num">{{ $cantidad }}</span><br>{{ $estatus }}</td>
            @endforeach
        </tr>
    </table>

    <strong>Extintores por tipo</strong>
    <table class="tipos">
        <thead>
            <tr><th>Tipo</th><th>Clase de fuego</th><th>Cantidad</th></tr>
        </thead>
        <tbody>
            @foreach ($por_tipo as $t)
                <tr><td>{{ $t['tipo'] }}</td><td>{{ $t['clase_fuego'] }}</td><td>{{ $t['cantidad'] }}</td></tr>
            @endforeach
        </tbody>
    </table>

    <table class="datos">
        <thead>
            <tr>
                <th>ID</th><th>Tipo</th><th>Capacidad</th><th>Edificio / Área</th><th>Piso</th>
                <th>Ubicación</th><th>Estatus</th><th>Último mantenimiento</th><th>Próxima revisión</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($filas as $fila)
                <tr>
                    <td>{{ $fila['id'] }}</td>
                    <td>{{ $fila['tipo'] }}</td>
                    <td>{{ $fila['capacidad'] }}</td>
                    <td>{{ $fila['edificio'] }}</td>
                    <td>{{ $fila['piso'] }}</td>
                    <td>{{ $fila['ubicacion'] }}</td>
                    <td>{{ $fila['estatus'] }}</td>
                    <td>{{ $fila['ultimo_mantenimiento'] }}</td>
                    <td>{{ $fila['proxima_revision'] }}</td>
                </tr>
            @empty
                <tr><td colspan="9" class="vacio">Sin extintores en el inventario con los filtros seleccionados.</td></tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>