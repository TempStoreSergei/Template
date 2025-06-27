// stores/groceryStore.ts
import { defineStore } from "pinia";

export type GroceryItem = {
  id: number;
  groceryName: string;
  categoryId: number; // ID категории
  groceryLifeTime: number; // Срок хранения
  groceryInStock: number; // Количество в наличии
  groceryUnit: number; // ID из стора единиц измерения
  groceryImages: string; // URL или Base64 строка
};

type GroceryState = {
  groceries: GroceryItem[];
};

export const useGroceryStore = defineStore("groceryStore", {
  state: (): GroceryState => ({
    groceries: [],
  }),
  getters: {
    // Получить список всех заготовок
    getGroceryList: (state) => state.groceries,

    // Получить заготовку по ID
    getGroceryById: (state) => (id: number) =>
      state.groceries.find((grocery) => grocery.id === id),

    // Получить заготовки по категории
    getGroceriesByCategory: (state) => (categoryId: number) =>
      state.groceries.filter((grocery) => grocery.categoryId === categoryId),
  },
  actions: {
    // Установить список заготовок
    setGroceries(groceries: GroceryItem[]) {
      this.groceries = groceries;
    },

    // Добавить новую заготовку с автогенерацией ID
    addGrocery(grocery: Omit<GroceryItem, "id">) {
      const newId =
        this.groceries.length > 0
          ? Math.max(...this.groceries.map((g) => g.id)) + 1
          : 1;

      this.groceries.push({ ...grocery, id: newId });
    },

    // Обновить существующую заготовку
    updateGrocery(updatedGrocery: GroceryItem) {
      const index = this.groceries.findIndex((grocery) => grocery.id === updatedGrocery.id);
      if (index !== -1) {
        this.groceries[index] = updatedGrocery;
      }
    },

    // Удалить заготовку
    deleteGrocery(groceryId: number) {
      this.groceries = this.groceries.filter((grocery) => grocery.id !== groceryId);
    },

    // Обновить количество в наличии
    updateGroceryStock(id: number, newStock: number) {
      const grocery = this.groceries.find((g) => g.id === id);
      if (grocery) {
        grocery.groceryInStock = newStock;
      }
    },
  },
});
