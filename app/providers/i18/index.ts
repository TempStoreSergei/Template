import { createI18n } from "vue-i18n";
import { localeMap } from "./config";
import { setHtmlPageLang, setLoadLocalePool } from "./helper";
import { useLocaleStoreWithOut } from "~/entities/language/modal/locale";

const createI18nOptions = async () => {
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
    fallbackLocale: localeMap.zh_CN,
    messages: {
      [locale]: message as { [key: string]: string },
    },
    globalInjection: true,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
  };
}

const options = await createI18nOptions();
export const i18n = createI18n(options);
