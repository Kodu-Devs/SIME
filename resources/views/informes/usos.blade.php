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
    </style>
</head>
<body>
    <div class="pie">{{ $encabezado['folio'] }} · Página <span class="pagina"></span></div>

    <h1>Informe de eventos de uso</h1>
    <table class="meta">
        <tr>
            <td><strong>Periodo:</strong> {{ $encabezado['periodo'] }}</td>
            <td><strong>Área:</strong> {{ $encabezado['area'] }}</td>
            <td><strong>Folio:</strong> {{ $encabezado['folio'] }}</td>
            <td><strong>Generado:</strong> {{ $encabezado['generado'] }}</td>
        </tr>
    </table>

    <table class="resumen">
        <tr>
            <td><span class="num">{{ $resumen['eventos'] }}</span><br>Eventos</td>
            <td><span class="num">{{ $resumen['total'] }}</span><br>Uso total</td>
            <td><span class="num">{{ $resumen['parcial'] }}</span><br>Uso parcial</td>
            <td><span class="num">{{ $resumen['extintores'] }}</span><br>Extintores involucrados</td>
        </tr>
    </table>

    <table class="datos">
        <thead>
            <tr>
                <th>Fecha</th><th>Hora</th><th>Extintor</th><th>Tipo</th>
                <th>Edificio / Área</th><th>Ubicación</th><th>Tipo de descarga</th>
                <th>Tipo de motivo</th><th>Descripción</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($filas as $fila)
                <tr>
                    <td>{{ $fila['fecha'] }}</td>
                    <td>{{ $fila['hora'] }}</td>
                    <td>{{ $fila['extintor'] }}</td>
                    <td>{{ $fila['tipo'] }}</td>
                    <td>{{ $fila['edificio'] }}</td>
                    <td>{{ $fila['ubicacion'] }}</td>
                    <td>{{ $fila['tipo_descarga'] }}</td>
                    <td>{{ $fila['tipo_motivo'] }}</td>
                    <td>{{ $fila['descripcion'] }}</td>
                </tr>
            @empty
                <tr><td colspan="9" class="vacio">Sin eventos de uso en el periodo seleccionado.</td></tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>