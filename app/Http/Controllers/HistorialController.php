<?php

namespace App\Http\Controllers;

use App\Models\EventoUso;
use App\Models\Mantenimiento;
use App\Models\Extintor;
use App\Models\Capacitacion;
use App\Exports\InformeExtintoresExport;
use App\Services\AlertaService;
use App\Services\EstatusExtintor;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;


use App\Exports\InformeUsosExport;
use Maatwebsite\Excel\Facades\Excel;

use App\Services\InformesHistorial;
use Barryvdh\DomPDF\Facade\Pdf;

class HistorialController extends Controller
{
    /**
     * Muestra el historial unificado de eventos (usos y mantenimientos) paginado y con filtros.
     */
    public function index(Request $request)
    {
        // Sin sesión no se mandan datos del historial (se verían con F12)
        if (!Auth::check()) {
            return Inertia::render('Historial/Index', [
                'eventos' => [],
                'filters' => []
            ]);
        }

        $tipo = $request->input('tipo', 'todos');
        if (!in_array($tipo, ['todos', 'usos', 'mantenimientos'], true)) {
            $tipo = 'todos';
        }

        // 1. Consulta de Eventos de Uso
        $usos = in_array($tipo, ['todos', 'usos'], true)
            ? EventoUso::with(['extintor.ubicacion.piso.instalacion', 'usuario', 'capacitacion'])
                ->when($request->search, function ($query, $search) {
                    $query->whereHas('extintor', function ($q) use ($search) {
                        $q->where('etiqueta_inventario', 'like', "%{$search}%");
                    });
                })
                ->when($request->instalacion_id, function ($query, $instalacionId) {
                    $query->whereHas('extintor.ubicacion.piso', function ($q) use ($instalacionId) {
                        $q->where('instalacion_id', $instalacionId);
                    });
                })
                ->when($request->fecha_inicio, function ($query, $fechaInicio) {
                    $query->whereDate('fecha', '>=', $fechaInicio);
                })
                ->when($request->fecha_fin, function ($query, $fechaFin) {
                    $query->whereDate('fecha', '<=', $fechaFin);
                })
                ->get()
                ->map(function ($uso) {
                    return [
                        'id' => 'uso_' . $uso->id,
                        'tipo_evento' => 'Uso',
                        'fecha' => $uso->fecha?->format('Y-m-d H:i:s'),
                        'estado_vencimiento' => $uso->extintor ? $uso->extintor->estadoVencimiento() : null,
                        'tipo_motivo' => $uso->tipo_motivo,
                        'detalle' => $uso->motivo,
                        'subtipo' => $uso->tipo_descarga,
                        'extintor' => $uso->extintor,
                        'usuario' => $uso->usuario ? $uso->usuario->name : 'Sistema',
                        'capacitacion' => $uso->capacitacion,
                    ];
                })
            : collect();

        // 2. Consulta de Mantenimientos (Solo los realizados)
        $mantenimientos = in_array($tipo, ['todos', 'mantenimientos'], true)
            ? Mantenimiento::with(['extintor.ubicacion.piso.instalacion'])
                ->whereNotNull('fecha_realizada')
                ->when($request->search, function ($query, $search) {
                    $query->whereHas('extintor', function ($q) use ($search) {
                        $q->where('etiqueta_inventario', 'like', "%{$search}%");
                    });
                })
                ->when($request->instalacion_id, function ($query, $instalacionId) {
                    $query->whereHas('extintor.ubicacion.piso', function ($q) use ($instalacionId) {
                        $q->where('instalacion_id', $instalacionId);
                    });
                })
                ->when($request->fecha_inicio, function ($query, $fechaInicio) {
                    $query->whereDate('fecha_realizada', '>=', $fechaInicio);
                })
                ->when($request->fecha_fin, function ($query, $fechaFin) {
                    $query->whereDate('fecha_realizada', '<=', $fechaFin);
                })
                ->get()
                ->map(function ($mant) {
                    return [
                        'id' => 'mant_' . $mant->id,
                        'tipo_evento' => 'Mantenimiento',
                        'fecha' => $mant->fecha_realizada?->format('Y-m-d H:i:s'),
                        'estado_vencimiento' => $mant->extintor ? $mant->extintor->estadoVencimiento() : null,
                        'tipo_motivo' => null,
                        'detalle' => $mant->descripcion ?? $mant->tipo,
                        'subtipo' => $mant->tipo,
                        'extintor' => $mant->extintor,
                        'usuario' => 'Personal de Servicio',
                        'capacitacion' => null,
                    ];
                })
            : collect();

        // 3. Combinar ambos tipos de eventos en una sola línea de tiempo ordenada
        $eventos = $usos->concat($mantenimientos)
            ->sortByDesc('fecha')
            ->values();

        // 4. Paginar la colección combinada (10 por página) manteniendo parámetros de filtro
        $perPage = 10;
        $page = LengthAwarePaginator::resolveCurrentPage();
        $eventosPaginados = (new LengthAwarePaginator(
            $eventos->forPage($page, $perPage)->values(),
            $eventos->count(),
            $perPage,
            $page,
            ['path' => $request->url()]
        ))->withQueryString();

        // 5. Catálogos para los selects del Front ordenados
        $extintoresParaSelect = Extintor::whereNotIn('estatus', ['Baja', 'Vacío'])
            ->orderBy('etiqueta_inventario')
            ->get(['id', 'etiqueta_inventario']);

        $capacitacionesParaSelect = Capacitacion::where('fecha_hora', '<=', now())
            ->orderByDesc('fecha_hora')
            ->get(['id', 'nombre']);

        return Inertia::render('Historial/Index', [
            'eventos' => $eventosPaginados,
            'extintores' => $extintoresParaSelect,
            'capacitaciones' => $capacitacionesParaSelect,
            'filters' => [
                'tipo' => $tipo,
                'instalacion_id' => $request->input('instalacion_id'),
                'search' => $request->input('search'),
                'fecha_inicio' => $request->input('fecha_inicio'),
                'fecha_fin' => $request->input('fecha_fin'),
            ],
            'edificios' => app(InformesHistorial::class)->edificios(),
        ]);
    }

  /**
     * Registra un nuevo uso de extintor y actualiza su estatus.
     */
    public function storeUso(Request $request)
    {
        if ($request->has('tipo_descarga') && is_string($request->tipo_descarga)) {
            $request->merge([
                'tipo_descarga' => mb_strtolower(trim($request->tipo_descarga)),
            ]);
        }

        $validated = $request->validate([
            'extintor_id' => [
                'required',
                Rule::exists('extintores', 'id')->where(function ($query) {
                    $query->whereNotIn('estatus', ['Baja', 'Vacío']);
                }),
            ],
            'tipo_descarga' => ['required', Rule::in(['total', 'parcial'])],
            'fecha' => ['required', 'date', 'before_or_equal:now'],
            'tipo_motivo' => ['required', Rule::in(EventoUso::TIPOS_MOTIVO)],
            'motivo' => ['required', 'string', 'max:500'],
            'capacitacion_id' => ['nullable', 'exists:capacitaciones,id'],
        ], [
            'extintor_id.exists' => 'El extintor no existe, está vacío o fue dado de baja.',
        ]);

        if (!empty($validated['capacitacion_id']) && $validated['tipo_motivo'] !== 'Capacitación') {
            return back()->withErrors(['tipo_motivo' => 'El tipo de motivo debe ser "Capacitación" si se selecciona una.']);
        }

        DB::transaction(function () use ($validated) {
            $validated['user_id'] = Auth::id();
            EventoUso::create($validated);

            $extintor = Extintor::findOrFail($validated['extintor_id']);
            EstatusExtintor::trasUso($extintor, ucfirst($validated['tipo_descarga']));

            if ($validated['tipo_descarga'] === 'parcial') {
                EstatusExtintor::cambiarA($extintor, 'Medio uso');
            }

            AlertaService::evaluarExtintor($extintor);
        });

        return redirect()->back()->with('success', 'Uso del extintor registrado correctamente.');
    }

    public function exportar(Request $request, InformesHistorial $informes)
    {
        $validated = $request->validate([
            'formato' => ['required', Rule::in(['pdf', 'excel'])],
            'informe' => ['required', Rule::in(['usos', 'extintores'])],
            'fecha_inicio' => ['required_if:informe,usos', 'nullable', 'date'],
            'fecha_fin' => ['required_if:informe,usos', 'nullable', 'date', 'after_or_equal:fecha_inicio'],
            'instalacion_id' => [
                'nullable',
                'required_with:piso_id',
                Rule::exists('instalaciones', 'id'),
            ],
            'piso_id' => [
                'nullable',
                Rule::exists('pisos', 'id')->where('instalacion_id', $request->instalacion_id),
            ],
        ]);

        if ($validated['informe'] === 'usos') {
            $datos = $informes->usos($validated);
            $nombre = $datos['encabezado']['folio'];

            if ($validated['formato'] === 'pdf') {
                return Pdf::loadView('informes.usos', $datos)
                    ->setPaper('letter', 'landscape')
                    ->download($nombre . '.pdf');
            }

            return Excel::download(new InformeUsosExport($datos), $nombre . '.xlsx');
        }
        if ($validated['informe'] === 'extintores') {
            $datos = $informes->extintores($validated);
            $nombre = $datos['encabezado']['folio'];

            if ($validated['formato'] === 'pdf') {
                return Pdf::loadView('informes.extintores', $datos)
                    ->setPaper('letter', 'landscape')
                    ->download($nombre . '.pdf');
            }

            return Excel::download(new InformeExtintoresExport($datos), $nombre . '.xlsx');
        }
    }
}