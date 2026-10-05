<?php

use App\Http\Controllers\Api\InventoryMovementController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// Aquí defino las rutas de la API. Laravel les agrega el prefijo /api automáticamente.

// apiResource crea de una vez las 5 rutas del CRUD de productos:
// GET /api/products, POST /api/products, GET /api/products/{id},
// PUT o PATCH /api/products/{id} y DELETE /api/products/{id}
Route::apiResource('products', ProductController::class);

// Los movimientos solo tienen GET (ver el historial) y POST (registrar uno nuevo).
// No hay editar ni borrar, porque son un historial y no deben cambiarse.
Route::get('inventory-movements', [InventoryMovementController::class, 'index']);
Route::post('inventory-movements', [InventoryMovementController::class, 'store']);
