<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Tabla de movimientos: cada fila es una entrada o una salida de un producto
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();

            // Llave foránea: product_id debe ser el id de un producto que exista.
            // restrictOnDelete = no deja borrar un producto que ya tenga movimientos.
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();

            $table->enum('type', ['IN', 'OUT']);            // solo acepta IN (entrada) u OUT (salida)
            $table->unsignedInteger('quantity');            // cantidad, sin negativos
            $table->string('description', 255)->nullable(); // motivo, opcional
            $table->timestamps();                           // created_at es la fecha del movimiento

            // Índice para consultar rápido los movimientos de un producto, ordenados por fecha
            $table->index(['product_id', 'created_at']);
        });

        // La cantidad debe ser mayor que 0
        DB::statement('ALTER TABLE inventory_movements ADD CONSTRAINT chk_movements_quantity CHECK (quantity > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
