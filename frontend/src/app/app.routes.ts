import { Routes } from '@angular/router';
import { MovementForm } from './pages/movement-form/movement-form';
import { MovementHistory } from './pages/movement-history/movement-history';
import { ProductForm } from './pages/product-form/product-form';
import { ProductList } from './pages/product-list/product-list';

// Cada ruta conecta una dirección del navegador con la pantalla (componente) que se muestra
export const routes: Routes = [
  // Si entran a la dirección vacía, los llevo a /products
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductList },
  // El mismo formulario sirve para crear y para editar; ":id" es un valor que cambia en la dirección
  { path: 'products/new', component: ProductForm },
  { path: 'products/:id/edit', component: ProductForm },
  { path: 'movements', component: MovementHistory },
  { path: 'movements/new', component: MovementForm },
];
