// ~/stores/dishGroupStore.ts
import { defineStore } from "pinia";

interface DishGroup {
  id: number;
  categoryName: string;
}

export const useDishGroupStore = defineStore("dishGroupStore", {
  state: () => ({
    dishGroups: [] as DishGroup[], // Список групп блюд
    nextId: 1, // Уникальный идентификатор для новых групп
  }),
  getters: {
    getDishGroupList: (state) => state.dishGroups,
    getDishGroupCount: (state) => state.dishGroups.length,
  },
  actions: {
    // Добавление новой группы
    createDishGroup(group: { categoryName: string }) {
      this.dishGroups.push({
        id: this.nextId++,
        categoryName: group.categoryName,
      });
    },
    // Обновление группы
    updateDishGroup(id: number, updatedGroup: { categoryName: string }) {
      const group = this.dishGroups.find((g) => g.id === id);
      if (group) {
        group.categoryName = updatedGroup.categoryName;
      }
    },
    // Удаление группы
    deleteDishGroup(id: number) {
      this.dishGroups = this.dishGroups.filter((group) => group.id !== id);
    },
    // Получение группы по ID
    getDishGroupById(id: number) {
      return this.dishGroups.find((group) => group.id === id);
    },
  },
});
