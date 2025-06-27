import { ref } from "vue";
import { defineStore } from "pinia";
import { store } from "~/app/providers/store";

export type Group = {
  id: number; // Уникальный ID группы
  categoryName: string; // Название категории
};

export const useGroupStore = defineStore(
  "groups",
  () => {
    const groups = ref<Group[]>([]); // Массив групп
    const idCounter = ref(1); // Счетчик для генерации ID

    /**
     * Добавление новой группы.
     * @param group - Группа без ID.
     */
    const createGroup = (group: Omit<Group, "id">) => {
      const newGroup = { id: idCounter.value++, ...group };
      groups.value.push(newGroup);
      return newGroup;
    };

    /**
     * Обновление группы по ID.
     * @param id - ID группы для обновления.
     * @param updatedData - Обновленные данные группы.
     */
    const updateGroup = (id: number, updatedData: Partial<Group>) => {
      const groupIndex = groups.value.findIndex((group) => group.id === id);
      if (groupIndex !== -1) {
        groups.value[groupIndex] = {
          ...groups.value[groupIndex],
          ...updatedData,
        };
      }
    };

    /**
     * Удаление группы по ID.
     * @param id - ID группы для удаления.
     */
    const deleteGroup = (id: number) => {
      groups.value = groups.value.filter((group) => group.id !== id);
    };

    /**
     * Получение всех групп.
     * @returns Массив всех групп.
     */
    const getAllGroups = (param: any) => {
      console.log(param);
      return groups.value;
    };

    /**
     * Получение общего количества групп.
     * @returns Количество групп.
     */
    const getGroupCount = () => {
      return groups.value.length;
    };

    /**
     * Сброс хранилища: очистка всех групп и сброс счетчика ID.
     */
    const resetStore = () => {
      groups.value = [];
      idCounter.value = 1;
    };

    return {
      groups,
      createGroup,
      updateGroup,
      deleteGroup,
      getAllGroups,
      getGroupCount,
      resetStore,
    };
  },
  {
    persist: true, // Сохранять данные хранилища между перезагрузками страницы
  },
);

// Для использования вне setup-функций компонентов
export function useGroupStoreWithout() {
  return useGroupStore(store);
}
