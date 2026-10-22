<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Extintor;
use App\Models\TipoExtintor;
use App\Models\Instalacion;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ExtintorController extends Controller
{
    public function index()
    {
        // Se filtran los extintores dados de baja para que no aparezcan en la tabla activa
        $extintores = Extintor::where('estatus', '!=', 'Baja')
            ->with(['ubicacion.piso', 'tipoExtintor', 'mantenimientos'])
            ->paginate(10)
            ->through(fn ($extintor) => [
                'id' => $extintor->id,
                'etiqueta_inventario' => $extintor->etiqueta_inventario,
                'estatus' => $extintor->estatus,
                'capacidad' => $extintor->capacidad,
                'tipo_nombre' => $extintor->tipoExtintor?->nombre ?? 'No definido',
                'ubicacion_nombre' => $extintor->ubicacion?->nombre ?? 'Sin ubicación',
                'piso_numero' => $extintor->ubicacion?->piso?->numero ?? 'N/A',
                // Extrae la fecha del mantenimiento pendiente más próximo
                'proximo_mantenimiento' => $extintor->mantenimientos
                    ->whereNull('fecha_realizada')
                    ->sortBy('fecha_programada')
                    ->first()?->fecha_programada?->format('d/m/y') 
                    ?? 'Sin programar'
            ]);

        // Carga de catálogos necesarios para que el frontend arme los selectores
        $tipos = TipoExtintor::select('id', 'nombre')->get();
    
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
        $listaCapacidades = ($tipoSeleccionado && $tipoSeleccionado->unidad === 'l') 
                        ? Extintor::CAPACIDADES_L 
                        : Extintor::CAPACIDADES_KG;
        // Validación estricta de los datos enviados por el usuario
        $validated = $request->validate([
            'tipoextintor_id' => 'required|exists:tipo_extintores,id',
            'ubicacion_id' => 'required|exists:ubicaciones,id',
            'capacidad' => ['required', Rule::in($listaCapacidades)],
            'fecha_instalacion' => 'required|date',
            'fecha_vencimiento' => 'required|date|after:fecha_instalacion', 
        ], [
            'tipoextintor_id.required' => 'Debes seleccionar el tipo de extintor.',
            'tipoextintor_id.exists' => 'El tipo seleccionado no es válido en el catálogo.',
            'ubicacion_id.required' => 'Debes seleccionar la ubicación exacta del extintor.',
            'ubicacion_id.exists' => 'La ubicación seleccionada no existe en el sistema.',
            'capacidad.required' => 'La capacidad del extintor es obligatoria.',
            'fecha_instalacion.required' => 'Indica cuándo se instaló el extintor.',
            'fecha_instalacion.date' => 'La fecha de instalación tiene un formato incorrecto.',
            'fecha_vencimiento.required' => 'La fecha de caducidad es obligatoria.',
            'fecha_vencimiento.after' => 'La fecha de vencimiento no puede ser antes de la instalación',
        ]);

        // Cálculo seguro del siguiente folio para evitar duplicados en la base de datos
        $ultimoExtintor = Extintor::latest('id')->first();
        $siguienteFolio = $ultimoExtintor ? 
                          str_pad((int)substr($ultimoExtintor->etiqueta_inventario, -5) + 1, 5, '0', STR_PAD_LEFT) : 
                          '00001';
        $nuevaEtiqueta = 'ITJMM-62007-5100-' . $siguienteFolio;
        
        // Creación del registro asignando la etiqueta generada automáticamente
        Extintor::create([
            'etiqueta_inventario' => $nuevaEtiqueta,
            'tipoextintor_id' => $validated['tipoextintor_id'],
            'ubicacion_id' => $validated['ubicacion_id'],
            'capacidad' => $validated['capacidad'],
            'fecha_instalacion' => $validated['fecha_instalacion'],
            'fecha_vencimiento' => $validated['fecha_vencimiento'],
            'estatus' => 'Disponible',
        ]);

        return redirect()->route('extintores.index')
            ->with('success', 'El extintor se registró correctamente con el folio: ' . $nuevaEtiqueta);
    }

    public function update(Request $request, Extintor $extintor)
    {
        $tipoSeleccionado = TipoExtintor::find($request->tipoextintor_id);
        $listaCapacidades = ($tipoSeleccionado && $tipoSeleccionado->unidad === 'l') 
                        ? Extintor::CAPACIDADES_L 
                        : Extintor::CAPACIDADES_KG;
        // Se reutilizan las reglas de validación para asegurar la integridad de los datos a actualizar
        $validated = $request->validate([
            'tipoextintor_id' => 'required|exists:tipo_extintores,id',
            'ubicacion_id' => 'required|exists:ubicaciones,id',
            'capacidad' => ['required', Rule::in($listaCapacidades)],
            'fecha_instalacion' => 'required|date',
            'fecha_vencimiento' => 'required|date|after:fecha_instalacion', 
        ], [
            'tipoextintor_id.required' => 'Debes seleccionar el tipo de extintor.',
            'tipoextintor_id.exists' => 'El tipo seleccionado no es válido.',
            'ubicacion_id.required' => 'Debes seleccionar la ubicación exacta.',
            'ubicacion_id.exists' => 'La ubicación seleccionada no existe.',
            'capacidad.required' => 'La capacidad es obligatoria.',
            'fecha_instalacion.required' => 'Indica la fecha de instalación.',
            'fecha_instalacion.date' => 'Formato de fecha inválido.',
            'fecha_vencimiento.required' => 'La fecha de caducidad es obligatoria.',
            'fecha_vencimiento.after' => 'La fecha de vencimiento debe ser posterior a la instalación.',
        ]);

        // Actualización directa utilizando Route Model Binding. La etiqueta de inventario no se modifica.
        $extintor->update([
            'tipoextintor_id' => $validated['tipoextintor_id'],
            'ubicacion_id' => $validated['ubicacion_id'],
            'capacidad' => $validated['capacidad'],
            'fecha_instalacion' => $validated['fecha_instalacion'],
            'fecha_vencimiento' => $validated['fecha_vencimiento'],
        ]);

        return redirect()->route('extintores.index')
            ->with('success', "El extintor {$extintor->etiqueta_inventario} se actualizó correctamente.");
    }

    public function baja(Extintor $extintor)
    {
        $extintor->update([
            'estatus' => 'Baja'
        ]);

        return redirect()->route('extintores.index')
            ->with('success', "El extintor {$extintor->etiqueta_inventario} ha sido dado de baja.");
    }
}