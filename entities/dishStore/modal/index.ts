// stores/dishStore.ts
import { defineStore } from "pinia";

export type GroceryItem = {
  ingredientName?: string;
  ingredientWeights?: number;
  key?: number;
  unitId: number; // ID из стора единиц измерения
};

export type DishItem = {
  id: number;
  dishName: string;
  dishRecipe: string;
  dishImg: string; // URL или Base64-строка
  dishGroceriesAmount: number;
  dishLifeTime: number;
  dishCategoryId: number; // ID из стора категорий блюд
  dishIngredients: GroceryItem[];
};

type DishState = {
  dishes: DishItem[];
};

export const useDishStore = defineStore("dishStore", {
  state: (): DishState => ({
    dishes: [],
  }),
  getters: {
    // Получить список всех блюд
    getDishList: (state) => state.dishes,

    // Получить блюдо по ID
    getDishById: (state) => (id: number) =>
      state.dishes.find((dish) => dish.id === id),

    // Получить блюда по категории
    getDishesByCategory: (state) => (categoryId: number) =>
      state.dishes.filter((dish) => dish.dishCategoryId === categoryId),
  },
  actions: {
    // Установить список блюд
    setDishes(dishes: DishItem[]) {
      this.dishes = dishes;
    },

    // Добавить новое блюдо
    addDish(dish: DishItem) {
      this.dishes.push(dish);
    },

    // Обновить существующее блюдо
    updateDish(updatedDish: DishItem) {
      const index = this.dishes.findIndex((dish) => dish.id === updatedDish.id);
      if (index !== -1) {
        this.dishes[index] = updatedDish;
      }
    },

    // Удалить блюдо
    deleteDish(dishId: number) {
      this.dishes = this.dishes.filter((dish) => dish.id !== dishId);
    },
  },
});