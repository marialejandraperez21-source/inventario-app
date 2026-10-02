import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InventoryMovement, MovementInput } from '../models/inventory-movement.model';

@Injectable({ providedIn: 'root' })
export class InventoryMovementService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/inventory-movements`;

  getAll(productId?: number): Observable<InventoryMovement[]> {
    const params = productId
      ? new HttpParams().set('product_id', productId)
      : new HttpParams();
    return this.http.get<InventoryMovement[]>(this.url, { params });
  }

  create(movement: MovementInput): Observable<InventoryMovement> {
    return this.http.post<InventoryMovement>(this.url, movement);
  }
}