import { createPersistedState } from "pinia-plugin-persistedstate";
import { createPinia } from "pinia";

export const store = createPinia();

store.use(
  createPersistedState({
    key: (id) => `__persisted__${id}`,
    auto: false,
  }),
);
