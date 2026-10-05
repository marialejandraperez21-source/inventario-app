<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Este modelo representa la tabla "products": cada objeto Product es una fila.
class Product extends Model
{
    // Campos que se pueden guardar en bloque con create() y update().
    // Lo que no esté en esta lista, Laravel lo ignora.
    // El stock está aquí para poder fijarlo al crear el producto. Al editar no llega,
    // porque UpdateProductRequest no lo incluye entre sus reglas.
    protected $fillable = ['name', 'description', 'price', 'stock'];

    // Convierte los tipos al leer de la base: el precio sale como número y no como texto
    protected function casts(): array
    {
        return [
            'price' => 'float',
            'stock' => 'integer',
        ];
    }

    // Relación 1 a muchos: un producto tiene muchos movimientos.
    // Permite escribir $product->movements() en vez de armar la consulta a mano.
    public function movements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }
}
