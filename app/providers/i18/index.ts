import { createI18n } from "vue-i18n";
import { localeMap } from "./config";
import { setHtmlPageLang, setLoadLocalePool } from "./helper";
import type { App } from "vue";
import { useLocaleStoreWithOut } from "~/entities/language/modal/locale";

const createI18nOptions = async (): Promise<I18nOptions> => {
  const localeStore = useLocaleStoreWithOut();
  const locale = localeStore.getLocale;
  const defaultLocal = await import(`./lang/${locale}.ts`);
  const message = defaultLocal.default?.message ?? {};

  setHtmlPageLang(locale);
  setLoadLocalePool((loadLocalePool) => {
    loadLocalePool.push(locale);
  });

  return {
    locale,
    fallbackLocale: localeMap.ru,
    messages: {
      [locale]: message as { [key: string]: string },
    },
    globalInjection: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
  };
};

type Options = Awaited<ReturnType<typeof createI18nOptions>>;

// ReturnType<typeof createI18n<false, Options>>
export let i18n = createI18n({} as Options);

// setup i18n instance with global
export async function setupI18n(app: App) {
  const options = await createI18nOptions();
  i18n = createI18n(options);
  app.use(i18n);
}
