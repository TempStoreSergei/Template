import { defineStore } from "pinia";
import type { LocaleType } from "~/app/providers/i18/config";
import { store } from "~/app/providers/store";
import { LOCALE_KEY } from "~/enums/cacheEnum";
import { Storage } from "~/shared/utils/Storage";

interface LocaleState {
  locale: LocaleType;
}

export const useLocaleStore = defineStore({
  id: "locale",
  state: (): LocaleState => ({
    locale: Storage.get(LOCALE_KEY, "ru"),
  }),
  getters: {
    getLocale(): LocaleType {
      return this.locale ?? "ru";
    },
  },
  actions: {
    setLocale(locale: LocaleType) {
      this.locale = locale;
      Storage.set(LOCALE_KEY, locale);
    },
  },
});

// Need to be used outside the setup
export const useLocaleStoreWithOut = () => {
  return useLocaleStore(store);
};
