<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;

// Controlador del CRUD de productos.
// Recibe la petición, usa el modelo y devuelve la respuesta en JSON.
class ProductController extends Controller
{
    // GET /api/products: devuelve todos los productos ordenados por nombre
    public function index()
    {
        return Product::orderBy('name')->get();
    }

    // POST /api/products: crea un producto.
    // StoreProductRequest valida los datos antes de entrar aquí.
    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        // 201 significa "creado"
        return response()->json($product, 201);
    }

    // GET /api/products/{id}: devuelve un producto.
    // Laravel busca el producto con el id de la URL (route model binding)
    // y responde 404 solo si no existe.
    public function show(Product $product)
    {
        return $product;
    }

    // PUT /api/products/{id}: edita un producto.
    // UpdateProductRequest no tiene regla para "stock", así que el stock no cambia por aquí.
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return $product;
    }

    // DELETE /api/products/{id}: elimina un producto
    public function destroy(Product $product)
    {
        // Si el producto ya tiene movimientos no se borra, para no perder el historial.
        // 409 significa "conflicto": la petición es válida pero choca con el estado de los datos.
        if ($product->movements()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar un producto con movimientos de inventario.',
            ], 409);
        }

        $product->delete();

        // 204 significa "listo, sin contenido que devolver"
        return response()->noContent();
    }
}
