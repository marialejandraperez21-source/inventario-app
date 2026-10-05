<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// Validaciones para CREAR un producto.
// Si algo no cumple, Laravel responde 422 con los errores, sin llegar al controlador.
class StoreProductRequest extends FormRequest
{
    // true = se permite la petición. No hay login en este proyecto.
    // (Si se deja en false, todas las peticiones dan error 403.)
    public function authorize(): bool
    {
        return true;
    }

    // Reglas de cada campo
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],          // obligatorio, texto, máximo 150 caracteres
            'description' => ['nullable', 'string', 'max:1000'],  // opcional
            'price' => ['required', 'numeric', 'min:0'],          // obligatorio, número, no negativo
            'stock' => ['required', 'integer', 'min:0'],          // stock inicial: entero, no negativo
        ];
    }

    // Mensajes en español para cuando una regla falla
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'price.required' => 'El precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número.',
            'price.min' => 'El precio no puede ser negativo.',
            'stock.required' => 'El stock inicial es obligatorio.',
            'stock.integer' => 'El stock debe ser un número entero.',
            'stock.min' => 'El stock no puede ser negativo.',
        ];
    }
}
