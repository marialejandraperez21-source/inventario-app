<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// Validaciones para registrar un movimiento (entrada o salida)
class StoreInventoryMovementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // obligatorio, entero, y debe existir en la tabla products
            'product_id' => ['required', 'integer', 'exists:products,id'],
            // solo se acepta IN (entrada) u OUT (salida)
            'type' => ['required', 'in:IN,OUT'],
            // entero de al menos 1
            'quantity' => ['required', 'integer', 'min:1'],
            // motivo opcional
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Debes seleccionar un producto.',
            'product_id.exists' => 'El producto seleccionado no existe.',
            'type.required' => 'Debes indicar si es una entrada o una salida.',
            'type.in' => 'El tipo debe ser IN (entrada) u OUT (salida).',
            'quantity.required' => 'La cantidad es obligatoria.',
            'quantity.integer' => 'La cantidad debe ser un número entero.',
            'quantity.min' => 'La cantidad debe ser al menos 1.',
        ];
    }
}
