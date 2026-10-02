<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInventoryMovementRequest;
use App\Models\InventoryMovement;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryMovementController extends Controller
{
    public function index(Request $request)
    {
        return InventoryMovement::with('product:id,name')
            ->when($request->product_id, fn ($query, $id) => $query->where('product_id', $id))
            ->latest()
            ->get();
    }

    public function store(StoreInventoryMovementRequest $request)
    {
        $data = $request->validated();

        $movement = DB::transaction(function () use ($data) {
            $product = Product::lockForUpdate()->findOrFail($data['product_id']);

            if ($data['type'] === 'OUT' && $product->stock < $data['quantity']) {
                throw ValidationException::withMessages([
                    'quantity' => "Stock insuficiente. Stock disponible: {$product->stock}.",
                ]);
            }

            if ($data['type'] === 'IN') {
                $product->increment('stock', $data['quantity']);
            } else {
                $product->decrement('stock', $data['quantity']);
            }

            return $product->movements()->create($data);
        });

        return response()->json($movement->load('product:id,name,stock'), 201);
    }
}