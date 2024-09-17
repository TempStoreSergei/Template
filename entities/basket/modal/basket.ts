import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { store } from "~/app/providers/store";

export const useBasketStore = defineStore(
  "basket",
  () => {
    // Set to store good IDs
    const goodIds = ref<Map<number, number>>(new Map());

    // Add a good to the basket
    const addGood = (id: number) => {
      goodIds.value.set(id, 1);
    };

    const changeQuantity = (id: number, value: number) => {
      goodIds.value.set(id, value);
    };

    // Remove a good from the basket
    const removeGood = (id: number) => {
      goodIds.value.delete(id);
    };

    // Check if a good is in the basket
    const hasGood = (id: number) => {
      return goodIds.value.has(id);
    };

    const getGood = (id: number) => {
      return goodIds.value.get(id);
    };

    // Get the total count of goods in the basket
    const goodsCount = computed(() => goodIds.value.size);
    const goodsIds = computed(() => [...goodIds.value.keys()]);

    return {
      addGood,
      removeGood,
      hasGood,
      changeQuantity,
      getGood,
      goodsCount,
      goodsIds,
    };
  },
  {
    persist: true, // Persist store data across page reloads
  },
);

// For use outside of component setup functions
export function useBasketStoreWithout() {
  return useBasketStore(store);
}
