<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Instalacion;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class ExtintorController extends Controller
{
    public function index()
    {
        // Se filtran los extintores dados de baja para que no aparezcan en la tabla activa
        $extintores = Extintor::where('estatus', '!=', 'Baja')
            ->with(['ubicacion.piso', 'tipoExtintor', 'mantenimientos']) // Aquí está el with() que te pidieron revisar
            ->paginate(10)
            ->through(fn ($extintor) => [
                'id' => $extintor->id,
                'etiqueta_inventario' => $extintor->etiqueta_inventario,
                'estatus' => $extintor->estatus,
                // Directo al método como solicitó el frontend
                'estado' => $extintor->estadoVencimiento(),
                'capacidad' => $extintor->capacidad,
                'tipo_nombre' => $extintor->tipoExtintor?->nombre ?? 'No definido',
                'ubicacion_nombre' => $extintor->ubicacion?->nombre ?? 'Sin ubicación',
                'piso_numero' => $extintor->ubicacion?->piso?->numero ?? 'N/A',
                'tipoextintor_id' => $extintor->tipoextintor_id,
                'ubicacion_id' => $extintor->ubicacion_id,
                // Campo 1: Solo el mantenimiento pendiente de la agenda
                'proximo_mantenimiento' => $extintor->mantenimientos
                    ->whereNull('fecha_realizada')
                    ->sortBy('fecha_programada')
                    ->first()?->fecha_programada?->format('d/m/y') 
                    ?? 'Sin programar',
                // Campo 2: La fecha de vencimiento real (revisión)
                'proxima_revision' => $extintor->fecha_vencimiento 
                    ? Carbon::parse($extintor->fecha_vencimiento)->format('d/m/y') 
                    : 'Sin programar',
                // Objeto raw con datos originales para precargar el formulario en edición
                'raw' => [
                    'id' => $extintor->id,
                    'tipoextintor_id' => $extintor->tipoextintor_id,
                    'ubicacion_id' => $extintor->ubicacion_id,
                    'capacidad' => $extintor->capacidad,
                    'fecha_instalacion' => $extintor->fecha_instalacion ? Carbon::parse($extintor->fecha_instalacion)->format('Y-m-d') : null,
                    'fecha_vencimiento' => $extintor->fecha_vencimiento ? Carbon::parse($extintor->fecha_vencimiento)->format('Y-m-d') : null,
                    'estatus' => $extintor->estatus,
                ]
            ]);

        // Carga de catálogos necesarios para que el frontend arme los selectores
        $tipos = TipoExtintor::select('id', 'nombre', 'unidad')->get();
    
        $instalaciones = Instalacion::select('id', 'nombre')
            ->with([
                'pisos:id,instalacion_id,nombre',
                'pisos.ubicaciones:id,piso_id,nombre'
            ])
            ->get();

        return Inertia::render('Extintores/Index', [
            'extintores' => $extintores,
            'tipos' => $tipos,
            'instalaciones' => $instalaciones,
            'capacidades_kg' => Extintor::CAPACIDADES_KG,
            'capacidades_l' => Extintor::CAPACIDADES_L,
        ]);
    }

    public function store(Request $request)
    {
        $tipoSeleccionado = TipoExtintor::find($request->tipoextintor_id);
        
        // Normalizar la evaluación de la unidad para evitar errores de mayúsculas o espacios
        $unidad = strtolower(trim($tipoSeleccionado?->unidad ?? ''));
        $listaCapacidades = ($unidad === 'l') 
                        ? Extintor::CAPACIDADES_L 
                        : Extintor::CAPACIDADES_KG;

        $validated = $request->validate([
            'tipoextintor_id' => ['required', Rule::exists(TipoExtintor::class, 'id')],
            'ubicacion_id' => 'required|exists:ubicaciones,id',
            'capacidad' => ['required', Rule::in($listaCapacidades)],
            'fecha_instalacion' => 'required|date|before_or_equal:today',
        ], [
            'tipoextintor_id.required' => 'Debes seleccionar el tipo de extintor.',
            'tipoextintor_id.exists' => 'El tipo seleccionado no es válido en el catálogo.',
            'ubicacion_id.required' => 'Debes seleccionar la ubicación exacta del extintor.',
            'ubicacion_id.exists' => 'La ubicación seleccionada no existe en el sistema.',
            'capacidad.required' => 'La capacidad del extintor es obligatoria.',
            'fecha_instalacion.required' => 'Indica cuándo se instaló el extintor.',
            'fecha_instalacion.date' => 'La fecha de instalación tiene un formato incorrecto.',
            'fecha_instalacion.before_or_equal' => 'La fecha de instalación no puede ser futura.',
        ]);

        $ultimoExtintor = Extintor::latest('id')->first();
        $siguienteFolio = $ultimoExtintor ? 
                          str_pad((int)substr($ultimoExtintor->etiqueta_inventario, -5) + 1, 5, '0', STR_PAD_LEFT) : 
                          '00001';
        $nuevaEtiqueta = 'ITJMM-62007-5100-' . $siguienteFolio;
        
        Extintor::create([
            'etiqueta_inventario' => $nuevaEtiqueta,
            'tipoextintor_id' => $validated['tipoextintor_id'],
            'ubicacion_id' => $validated['ubicacion_id'],
            'capacidad' => $validated['capacidad'],
            'fecha_instalacion' => $validated['fecha_instalacion'],
            'fecha_vencimiento' => Extintor::calcularVencimiento($validated['fecha_instalacion']),
            'estatus' => 'Disponible',
        ]);

        return redirect()->route('extintores.index')
            ->with('success', 'El extintor se registró correctamente con el folio: ' . $nuevaEtiqueta);
    }

    public function update(Request $request, Extintor $extintor)
    {
        $tipoSeleccionado = TipoExtintor::find($request->tipoextintor_id);
        
        // Normalizar la evaluación de la unidad
        $unidad = strtolower(trim($tipoSeleccionado?->unidad ?? ''));
        $listaCapacidades = ($unidad === 'l') 
                        ? Extintor::CAPACIDADES_L 
                        : Extintor::CAPACIDADES_KG;

        $validated = $request->validate([
            'tipoextintor_id' => ['required', Rule::exists(TipoExtintor::class, 'id')],
            'ubicacion_id' => 'required|exists:ubicaciones,id',
            'capacidad' => ['required', Rule::in($listaCapacidades)],
            'fecha_instalacion' => 'required|date|before_or_equal:today',
        ], [
            'tipoextintor_id.required' => 'Debes seleccionar el tipo de extintor.',
            'tipoextintor_id.exists' => 'El tipo seleccionado no es válido.',
            'ubicacion_id.required' => 'Debes seleccionar la ubicación exacta.',
            'ubicacion_id.exists' => 'La ubicación seleccionada no existe.',
            'capacidad.required' => 'La capacidad es obligatoria.',
            'fecha_instalacion.required' => 'Indica cuándo se instaló el extintor.',
            'fecha_instalacion.date' => 'La fecha de instalación tiene un formato incorrecto.',
            'fecha_instalacion.before_or_equal' => 'La fecha de instalación no puede ser futura.',
        ]);

        $datos = [
            'tipoextintor_id' => $validated['tipoextintor_id'],
            'ubicacion_id' => $validated['ubicacion_id'],
            'capacidad' => $validated['capacidad'],
            'fecha_instalacion' => $validated['fecha_instalacion'],
        ];

        // Se recalcula el vencimiento solo si la fecha de instalación fue modificada
        $instalacionNueva = Carbon::parse($validated['fecha_instalacion'])->toDateString();
        $instalacionActual = Carbon::parse($extintor->fecha_instalacion)->toDateString();

        if ($instalacionNueva !== $instalacionActual) {
            $datos['fecha_vencimiento'] = Extintor::calcularVencimiento($validated['fecha_instalacion']);
        }

        $extintor->update($datos);

        return redirect()->route('extintores.index')
            ->with('success', "El extintor {$extintor->etiqueta_inventario} se actualizó correctamente.");
    }

    public function baja(Extintor $extintor)
    {
        $extintor->update([
            'estatus' => 'Baja'
        ]);

        return redirect()->route('extintores.index')
            ->with('success', "El extintor {$extintor->etiqueta_inventario} fue dado de baja correctamente.");
    }
}