import { ref } from "vue";
import { defineStore } from "pinia";
import { store } from "~/app/providers/store";

export type LockscreenState = {
  tabs: any;
  activeTab: number;
};

export const useTabsStore = defineStore(
  "tabs",
  () => {
    const activeTab = ref(0);
    const tabs = ref([]);

    const saveTabs = (value: any) => {
      tabs.value = value;
    };

    const setActiveIndex = (index: number) => {
      console.log(index);
      activeTab.value = index;
    };

    const getActiveTab = () => {
      return activeTab.value;
    };

    const getAllTabs = () => {
      return tabs.value;
    };

    return {
      setActiveIndex,
      saveTabs,
      getAllTabs,
      getActiveTab,
    };
  },
  {
    persist: true, // Persist store data across page reloads
  },
);

// For use outside of component setup functions
export function useLockscreenStoreWithout() {
  return useTabsStore(store);
}
