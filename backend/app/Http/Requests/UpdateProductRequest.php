<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// Validaciones para EDITAR un producto.
// Es igual a la de crear, pero SIN el campo "stock" a propósito:
// el controlador usa validated(), que solo devuelve los campos que tienen regla,
// así que aunque alguien envíe "stock" al editar, nunca llega a guardarse.
// El stock solo cambia con movimientos de inventario.
class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'price.required' => 'El precio es obligatorio.',
            'price.numeric' => 'El precio debe ser un número.',
            'price.min' => 'El precio no puede ser negativo.',
        ];
    }
}
