export interface Ingredient {
  id: string;
  unit: string;
  ingredientName: string;
  ingredientWeight: number;
  itemId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateIngredientRequest {
  unit: string;
  ingredientName: string;
  ingredientWeight: number;
  itemId?: string;
}

export interface UpdateIngredientRequest {
  id: string;
  unit?: string;
  ingredientName?: string;
  ingredientWeight?: number;
} 