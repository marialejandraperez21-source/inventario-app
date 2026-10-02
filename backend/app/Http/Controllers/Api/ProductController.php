<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        return Product::orderBy('name')->get();
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return $product;
    }

    public function destroy(Product $product)
    {
        if ($product->movements()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar un producto con movimientos de inventario.',
            ], 409);
        }

        $product->delete();

        return response()->noContent();
    }
}