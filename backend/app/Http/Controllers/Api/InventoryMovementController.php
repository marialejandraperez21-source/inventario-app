<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInventoryMovementRequest;
use App\Models\InventoryMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

// Controlador de los movimientos de inventario (entradas y salidas)
class InventoryMovementController extends Controller
{
    // GET /api/inventory-movements: devuelve el historial.
    // Si llega ?product_id=3, solo trae los movimientos de ese producto.
    public function index(Request $request)
    {
        // with() trae también el nombre del producto de cada movimiento,
        // sin hacer una consulta por cada fila
        return InventoryMovement::with('product:id,name')
            ->when($request->product_id, fn ($query, $id) => $query->where('product_id', $id))
            ->latest() // del más reciente al más antiguo
            ->get();
    }

    // POST /api/inventory-movements: registra una entrada o salida y actualiza el stock
    public function store(StoreInventoryMovementRequest $request)
    {
        // Datos ya validados: producto existente, tipo IN/OUT y cantidad >= 1
        $data = $request->validated();

        // Transacción: o se guarda todo (stock y movimiento) o no se guarda nada.
        // Si dentro ocurre un error, Laravel deshace los cambios (rollback).
        $movement = DB::transaction(function () use ($data) {

            // lockForUpdate bloquea la fila de este producto hasta que termine la transacción.
            // Si dos salidas llegan al mismo tiempo, la segunda espera y ve el stock ya actualizado.
            $product = Product::lockForUpdate()->findOrFail($data['product_id']);

            // Regla de negocio: no se puede sacar más de lo que hay.
            // Se revisa DESPUÉS del bloqueo, para que el stock leído sea confiable.
            if ($data['type'] === 'OUT' && $product->stock < $data['quantity']) {
                // Este error cancela la transacción y responde 422
                throw ValidationException::withMessages([
                    'quantity' => "Stock insuficiente. Stock disponible: {$product->stock}.",
                ]);
            }

            // increment y decrement hacen UPDATE stock = stock + n (o - n) directamente en SQL
            if ($data['type'] === 'IN') {
                $product->increment('stock', $data['quantity']);
            } else {
                $product->decrement('stock', $data['quantity']);
            }

            // Se crea el movimiento enlazado a este producto
            return $product->movements()->create($data);
        });

        // 201 = creado. Se devuelve el movimiento con el producto ya actualizado.
        return response()->json($movement->load('product:id,name,stock'), 201);
    }
}
