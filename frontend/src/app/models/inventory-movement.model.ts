export type MovementType = 'IN' | 'OUT';

export interface InventoryMovement {
  id: number;
  product_id: number;
  type: MovementType;
  quantity: number;
  description: string | null;
  created_at: string;
  product?: { id: number; name: string; stock?: number };
}

export interface MovementInput {
  product_id: number;
  type: MovementType;
  quantity: number;
  description?: string | null;
}