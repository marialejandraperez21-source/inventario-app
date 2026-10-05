import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

// Pantalla que muestra la tabla de productos, con los botones de editar y eliminar
@Component({
  selector: 'app-product-list',
  // RouterLink para los enlaces y CurrencyPipe para dar formato de moneda al precio
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-list.html',
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);

  // Los signals guardan el estado de la pantalla: cuando cambian, la pantalla se actualiza sola
  products = signal<Product[]>([]);   // lista de productos
  loading = signal(true);             // true mientras se espera la respuesta
  errorMessage = signal('');          // mensaje de error para mostrar

  // ngOnInit se ejecuta al crearse la pantalla: aquí cargo los datos
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    // subscribe es lo que hace que la petición salga hacia la API
    this.productService.getAll().subscribe({
      next: (products) => {
        // Llegó la respuesta: guardo los productos y quito el "cargando"
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => {
        // Si falla (por ejemplo, el backend está apagado), muestro un mensaje claro
        this.errorMessage.set('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.');
        this.loading.set(false);
      },
    });
  }

  deleteProduct(product: Product): void {
    // confirm() pregunta antes de borrar; si dicen que no, no hago nada
    if (!confirm(`¿Eliminar "${product.name}"?`)) {
      return;
    }

    this.productService.delete(product.id).subscribe({
      // Si se borró, vuelvo a cargar la lista
      next: () => this.loadProducts(),
      // Si la API respondió con error (por ejemplo, 409 por tener movimientos), muestro su mensaje
      error: (err) => {
        this.errorMessage.set(err.error?.message ?? 'No se pudo eliminar el producto.');
      },
    });
  }
}
