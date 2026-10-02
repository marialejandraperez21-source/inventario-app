<?php

use App\Http\Controllers\Api\InventoryMovementController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::apiResource('products', ProductController::class);

Route::get('inventory-movements', [InventoryMovementController::class, 'index']);
Route::post('inventory-movements', [InventoryMovementController::class, 'store']);