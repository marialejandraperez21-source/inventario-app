import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productId: number | null = null;
  isEdit = false;

  loading = signal(false);
  saving = signal(false);
  errorMessage = signal('');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.maxLength(1000)]],
    price: [null as number | null, [Validators.required, Validators.min(0)]],
    stock: [null as number | null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.isEdit = true;
    this.productId = Number(id);
    this.form.controls.stock.disable();
    this.loading.set(true);

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

  invalid(field: 'name' | 'description' | 'price' | 'stock'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const value = this.form.getRawValue();
    const description = value.description.trim() || null;
    const name = value.name.trim();
    const price = Number(value.price);

    const request = this.productId
      ? this.productService.update(this.productId, { name, description, price })
      : this.productService.create({ name, description, price, stock: Number(value.stock) });

    request.subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(this.buildMessage(err));
        this.saving.set(false);
      },
    });
  }

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