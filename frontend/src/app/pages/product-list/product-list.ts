import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
        this.loading.set(false);
      },
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`¿Eliminar "${product.name}"?`)) {
      return;
    }

    this.productService.delete(product.id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'No se pudo eliminar el producto.');
      },
    });
  }
}