<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreMantenimientoRequest extends FormRequest
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
            'extintor_id' => ['required', Rule::exists('extintores', 'id')->whereNot('estatus', 'Baja')],
            'tipo' => ['required', 'in:Relleno de contenido,Revisión,Otra'],
            'descripcion' => ['nullable', 'string', 'max:255'],
            'fecha_programada' => ['required', 'date', 'after_or_equal:today'],
        ];
    }
}
