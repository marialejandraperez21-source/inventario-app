import { Routes } from '@angular/router';
import { ProductForm } from './pages/product-form/product-form';
import { ProductList } from './pages/product-list/product-list';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductList },
  { path: 'products/new', component: ProductForm },
  { path: 'products/:id/edit', component: ProductForm },
];