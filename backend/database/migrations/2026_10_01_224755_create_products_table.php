<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Una migración es el código que crea (up) o deshace (down) una tabla.
// Así la estructura de la base de datos queda guardada en el proyecto.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();                                  // clave primaria autoincremental
            $table->string('name', 150)->index();          // nombre (máx. 150) con índice para buscar más rápido
            $table->text('description')->nullable();       // descripción larga, opcional
            $table->decimal('price', 10, 2);               // precio con 2 decimales (decimal evita errores de redondeo)
            $table->unsignedInteger('stock')->default(0);  // stock sin negativos; empieza en 0
            $table->timestamps();                          // crea created_at y updated_at
        });

        // Restricción en la base de datos: el precio no puede ser negativo
        DB::statement('ALTER TABLE products ADD CONSTRAINT chk_products_price CHECK (price >= 0)');
    }

    public function down(): void
    {
        // Deshace lo que hizo up(): borra la tabla
        Schema::dropIfExists('products');
    }
};
