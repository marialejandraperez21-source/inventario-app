import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InventoryMovement, MovementInput } from '../models/inventory-movement.model';

// Servicio con las llamadas HTTP de los movimientos de inventario
@Injectable({ providedIn: 'root' })
export class InventoryMovementService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/inventory-movements`;

  // GET /api/inventory-movements
  // El productId es opcional: si viene, se envía como ?product_id=... para filtrar
  getAll(productId?: number): Observable<InventoryMovement[]> {
    const params = productId
      ? new HttpParams().set('product_id', productId)
      : new HttpParams();
    return this.http.get<InventoryMovement[]>(this.url, { params });
  }

  // POST /api/inventory-movements: registra una entrada o salida
  create(movement: MovementInput): Observable<InventoryMovement> {
    return this.http.post<InventoryMovement>(this.url, movement);
  }
}
