import type { Ingredient, CreateIngredientRequest, UpdateIngredientRequest } from "../model/types";

const generateId = () => `ing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const ingredientsApi = {
  async getAll(): Promise<Ingredient[]> {
    try {
      const stored = localStorage.getItem('ingredients');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading ingredients:', error);
      return [];
    }
  },

  async create(request: CreateIngredientRequest): Promise<Ingredient> {
    const ingredient: Ingredient = {
      id: generateId(),
      ...request,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const ingredients = await this.getAll();
      ingredients.push(ingredient);
      localStorage.setItem('ingredients', JSON.stringify(ingredients));
      return ingredient;
    } catch (error) {
      console.error('Error creating ingredient:', error);
      throw error;
    }
  },

  async update(request: UpdateIngredientRequest): Promise<Ingredient> {
    try {
      const ingredients = await this.getAll();
      const index = ingredients.findIndex(i => i.id === request.id);
      
      if (index === -1) {
        throw new Error('Ingredient not found');
      }

      ingredients[index] = {
        ...ingredients[index],
        ...request,
        updatedAt: Date.now(),
      };

      localStorage.setItem('ingredients', JSON.stringify(ingredients));
      return ingredients[index];
    } catch (error) {
      console.error('Error updating ingredient:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const ingredients = await this.getAll();
      const filtered = ingredients.filter(i => i.id !== id);
      localStorage.setItem('ingredients', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting ingredient:', error);
      throw error;
    }
  },

  async getByItemId(itemId: string): Promise<Ingredient[]> {
    try {
      const ingredients = await this.getAll();
      return ingredients.filter(i => i.itemId === itemId);
    } catch (error) {
      console.error('Error loading ingredients by item:', error);
      return [];
    }
  },

  async createDemoIngredients(): Promise<void> {
    const demoIngredients: CreateIngredientRequest[] = [
      {
        unitId: "unit_demo_1",
        ingredientName: "Мука пшеничная",
        ingredientWeight: 500,
      },
      {
        unitId: "unit_demo_2",
        ingredientName: "Сахар",
        ingredientWeight: 200,
      },
      {
        unitId: "unit_demo_3",
        ingredientName: "Яйца",
        ingredientWeight: 3,
      },
      {
        unitId: "unit_demo_4",
        ingredientName: "Молоко",
        ingredientWeight: 250,
      },
      {
        unitId: "unit_demo_1",
        ingredientName: "Масло сливочное",
        ingredientWeight: 100,
      },
      {
        unitId: "unit_demo_1",
        ingredientName: "Соль",
        ingredientWeight: 5,
      },
    ];

    for (const ingredientRequest of demoIngredients) {
      await this.create(ingredientRequest);
    }
  }
}; 