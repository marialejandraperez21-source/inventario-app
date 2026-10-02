import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product, ProductInput } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/products`;

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  create(product: ProductInput): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  update(id: number, product: ProductInput): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}