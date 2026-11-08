<?php

namespace App\Http\Requests;

use App\Models\Extintor;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;


class StoreCapacitacionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'fecha_hora' => ['required', 'date', 'after:now'],
            'ubicacion_id' => ['required', 'exists:ubicaciones,id'],
            'extintores_id' => ['nullable', 'array'],
            'extintores_id.*' => [
                'integer',
                'exists:extintores,id',
                function ($campo, $id, $error) {
                    $e = Extintor::find($id);
                    if ($e->estatus != 'Medio uso') { //Validacion en estado medio uso
                        $error("El extintor seleccionado no esta en medio uso.");
                    }
                    if ($e->mantenimientos()->where('fecha_realizada', '>=', now()->subWeek())->exists()) { //Validacion sin mantenimiento reciente
                        $error("El extintor seleccionado tuvo un mantenimiento reciente.");
                    }
                }
            ] //Validacion por cada id de extintor en existencia
        ];
    }
}
