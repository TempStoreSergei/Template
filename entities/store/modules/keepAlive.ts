import { defineStore } from 'pinia';
import { store } from '~/app/providers/store';

interface KeepAliveState {
  /** List of route component names to cache */
  list: string[];
}

export const useKeepAliveStore = defineStore({
  id: 'keep-alive',
  state: (): KeepAliveState => ({
    list: [],
  }),
  actions: {
    /**
     * Adds a component name or an array of names to the cache list.
     * @param name - Single component name or an array of component names.
     */
    add(name: string | string[]) {
      const namesToAdd = Array.isArray(name) ? name : [name];
      namesToAdd.forEach((item) => {
        if (item && !this.list.includes(item)) {
          this.list.push(item);
        }
      });
    },

    /**
     * Removes a component name or an array of names from the cache list.
     * @param name - Single component name or an array of component names.
     */
    remove(name: string | string[]) {
      const namesToRemove = Array.isArray(name) ? name : [name];
      this.list = this.list.filter((item) => !namesToRemove.includes(item));
    },

    /** Clears all component names from the cache list. */
    clear() {
      this.list = [];
    },
  },
});

// Function to access the store without setup function
export const useKeepAliveStoreWithOut = () => {
  return useKeepAliveStore(store);
};
