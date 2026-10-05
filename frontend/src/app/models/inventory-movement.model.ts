// IN = entrada (suma al stock) y OUT = salida (resta del stock)
export type MovementType = 'IN' | 'OUT';

// Un movimiento tal como llega desde la API
export interface InventoryMovement {
  id: number;
  product_id: number;
  type: MovementType;
  quantity: number;
  description: string | null;
  created_at: string;
  // La API incluye el producto relacionado (solo algunos de sus datos)
  product?: { id: number; name: string; stock?: number };
}

// Los datos que envío a la API para registrar un movimiento
export interface MovementInput {
  product_id: number;
  type: MovementType;
  quantity: number;
  description?: string | null;
}
