import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

// Formulario para crear y para editar un producto.
// Es el mismo componente para los dos casos: la dirección decide el modo
// (/products/new = crear, /products/:id/edit = editar).
@Component({
  selector: 'app-product-form',
  // ReactiveFormsModule es lo que permite usar formularios reactivos en la plantilla
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute); // para leer el :id de la dirección
  private router = inject(Router);        // para volver a la lista al terminar

  productId: number | null = null;
  isEdit = false; // true si estoy editando

  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');

  // Formulario reactivo: se define aquí en el código, con sus validaciones.
  // Cada campo tiene su valor inicial y una lista de reglas.
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(1000)]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    // El stock debe ser un entero (pattern: solo dígitos)
    stock: [null as number | null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
  });

  ngOnInit(): void {
    // Si la dirección trae un id, estoy editando; si no, estoy creando
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.isEdit = true;
    this.productId = Number(id);
    // Al editar el stock no se puede cambiar, así que desactivo ese campo
    this.form.controls.stock.disable();
    this.loading.set(true);

    // Cargo el producto para rellenar el formulario con sus datos
    this.productService.getById(this.productId).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description ?? '',
          price: product.price,
        });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(this.buildMessage(err));
        this.form.disable();
        this.loading.set(false);
      },
    });
  }

  // Dice si debo mostrar el error de un campo: solo después de que el usuario lo toca
  invalid(field: 'name' | 'description' | 'price' | 'stock'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    // Si el formulario tiene errores, marco todos los campos como "tocados"
    // para que se vean los mensajes, y no envío nada
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    // getRawValue incluye también el stock aunque esté desactivado
    const value = this.form.getRawValue();
    const description = value.description.trim() || null; // texto vacío se guarda como null
    const name = value.name.trim();
    const price = Number(value.price);

    // Si hay productId actualizo; si no, creo (el stock inicial solo se envía al crear)
    const request = this.productId
      ? this.productService.update(this.productId, { name, description, price })
      : this.productService.create({ name, description, price, stock: Number(value.stock) });

    request.subscribe({
      // Si salió bien, vuelvo a la lista
      next: () => this.router.navigate(['/products']),
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(this.buildMessage(err));
        this.saving.set(false);
      },
    });
  }

  // Convierte el error de la API en un mensaje claro para el usuario
  private buildMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
    }
    if (err.status === 404) {
      return 'El producto no existe.';
    }
    if (err.status === 422 && err.error?.errors) {
      return Object.values(err.error.errors).flat().join(' ');
    }
    return err.error?.message ?? 'Ocurrió un error inesperado.';
  }
}
