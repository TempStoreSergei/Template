import { ref } from "vue";
import { defineStore } from "pinia";
import { store } from "~/app/providers/store";
import { getGoodInfo } from "~/entities/description/api";

export type LockscreenState = {
  good: any;
  goodId: number;
  showDescription: boolean;
};

export const useGoodStore = defineStore(
  "good",
  () => {
    const goodId = ref(0);
    const good = ref({});
    const showDescription = ref(false);

    const saveGoodId = async (value: number) => {
      goodId.value = value;
      good.value = await getGoodInfo(goodId.value);
      openModal();
    };

    const getInfo = computed(() => {
      return good.value;
    });

    const closeModal = () => {
      showDescription.value = true;
    };

    const openModal = () => {
      showDescription.value = true;
    };

    const isVisible = computed({
      get: () => showDescription.value,
      set: (newValue) => {
        showDescription.value = newValue;
      },
    });

    return {
      saveGoodId,
      getInfo,
      isVisible,
      openModal,
      closeModal,
    };
  },
  {
    persist: true, // Persist store data across page reloads
  },
);

// For use outside of component setup functions
export function useLockscreenStoreWithout() {
  return useGoodStore(store);
}
