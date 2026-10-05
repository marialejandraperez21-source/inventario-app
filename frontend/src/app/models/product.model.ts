// Describe cómo es un producto cuando llega desde la API.
// TypeScript usa esto para avisarme si escribo mal el nombre de un campo.
export interface Product {
  id: number;
  name: string;
  description: string | null; // es null cuando no se escribió descripción
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

// Los datos que envío a la API al crear o editar un producto.
// El stock es opcional porque solo se envía al crear; al editar no se envía.
export interface ProductInput {
  name: string;
  description: string | null;
  price: number;
  stock?: number;
}
