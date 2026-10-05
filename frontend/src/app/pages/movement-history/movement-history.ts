import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InventoryMovement } from '../../models/inventory-movement.model';
import { InventoryMovementService } from '../../services/inventory-movement.service';
import { getErrorMessage } from '../../shared/http-error';

// Pantalla con el historial de movimientos (entradas y salidas)
@Component({
  selector: 'app-movement-history',
  // DatePipe sirve para dar formato a la fecha
  imports: [RouterLink, DatePipe],
  templateUrl: './movement-history.html',
})
export class MovementHistory implements OnInit {
  private movementService = inject(InventoryMovementService);

  movements = signal<InventoryMovement[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  // Al abrirse la pantalla, pido el historial a la API
  ngOnInit(): void {
    this.movementService.getAll().subscribe({
      next: (movements) => {
        this.movements.set(movements);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        // getErrorMessage convierte el error en un texto claro
        this.errorMessage.set(getErrorMessage(err));
        this.loading.set(false);
      },
    });
  }
}
