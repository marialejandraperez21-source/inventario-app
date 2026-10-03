import { MovementForm } from './pages/movement-form/movement-form';
import { MovementHistory } from './pages/movement-history/movement-history';
import { Routes } from '@angular/router';
import { ProductForm } from './pages/product-form/product-form';
import { ProductList } from './pages/product-list/product-list';

export const routes: Routes = [
  { path: 'movements', component: MovementHistory },
  { path: 'movements/new', component: MovementForm },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductList },
  { path: 'products/new', component: ProductForm },
  { path: 'products/:id/edit', component: ProductForm },
];