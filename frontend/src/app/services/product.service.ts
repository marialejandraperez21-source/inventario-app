import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductInput } from '../models/product.model';

// Este servicio concentra todas las llamadas HTTP de productos.
// Los componentes no saben nada de URLs: solo piden "dame los productos".
// providedIn: 'root' hace que Angular cree una sola copia para toda la aplicación.
@Injectable({ providedIn: 'root' })
export class ProductService {
  // inject() le pide a Angular la herramienta para hacer peticiones HTTP
  private http = inject(HttpClient);

  // La dirección base sale del archivo environment, así no la repito en cada método
  private url = `${environment.apiUrl}/products`;

  // Cada método devuelve un Observable: la petición solo sale cuando alguien hace subscribe().

  // GET /api/products
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  // GET /api/products/{id}
  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  // POST /api/products
  create(product: ProductInput): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  // PUT /api/products/{id}
  update(id: number, product: ProductInput): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, product);
  }

  // DELETE /api/products/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
