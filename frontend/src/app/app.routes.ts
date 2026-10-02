import { Routes } from '@angular/router';
import { ProductList } from './pages/product-list/product-list';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductList },
];