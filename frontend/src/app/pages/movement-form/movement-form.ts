import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { InventoryMovementService } from '../../services/inventory-movement.service';
import { ProductService } from '../../services/product.service';
import { getErrorMessage } from '../../shared/http-error';

@Component({
  selector: 'app-movement-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './movement-form.html',
})
export class MovementForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private movementService = inject(InventoryMovementService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  saving = signal(false);
  errorMessage = signal('');

  form = this.fb.nonNullable.group({
    product_id: [null as number | null, [Validators.required]],
    type: ['IN' as 'IN' | 'OUT', [Validators.required]],
    quantity: [null as number | null, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
    description: ['', [Validators.maxLength(255)]],
  });

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (products) => this.products.set(products),
      error: (err: HttpErrorResponse) => this.errorMessage.set(getErrorMessage(err)),
    });
  }

  selectedProduct(): Product | undefined {
    return this.products().find((p) => p.id === this.form.controls.product_id.value);
  }

  invalid(field: 'product_id' | 'type' | 'quantity' | 'description'): boolean {
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

    this.movementService
      .create({
        product_id: Number(value.product_id),
        type: value.type,
        quantity: Number(value.quantity),
        description: value.description.trim() || null,
      })
      .subscribe({
        next: () => this.router.navigate(['/movements']),
        error: (err: HttpErrorResponse) => {
          this.errorMessage.set(getErrorMessage(err));
          this.saving.set(false);
        },
      });
  }
}