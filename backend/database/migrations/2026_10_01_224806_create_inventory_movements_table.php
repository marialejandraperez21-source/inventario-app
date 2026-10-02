<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->restrictOnDelete();
            $table->enum('type', ['IN', 'OUT']);
            $table->unsignedInteger('quantity');
            $table->string('description', 255)->nullable();
            $table->timestamps();

            $table->index(['product_id', 'created_at']);
        });

        DB::statement('ALTER TABLE inventory_movements ADD CONSTRAINT chk_movements_quantity CHECK (quantity > 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};