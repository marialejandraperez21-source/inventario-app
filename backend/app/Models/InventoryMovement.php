<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Cada objeto InventoryMovement es una fila de "inventory_movements" (una entrada o una salida)
class InventoryMovement extends Model
{
    // Campos que se pueden guardar en bloque
    protected $fillable = ['product_id', 'type', 'quantity', 'description'];

    // Relación inversa: cada movimiento pertenece a un producto
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
