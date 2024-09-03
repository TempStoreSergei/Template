export type LocaleType = keyof typeof localeMap;

export const localeMap = {
  zh_CN: "zh_CN",
  en: "en",
  ru: "ru",
} as const;

export const localeList = [
  {
    lang: localeMap.en,
    label: "English",
    icon: "🇺🇸",
    title: "Language",
  },
  {
    lang: localeMap.ru,
    label: "Русский",
    icon: "🇷🇺",
    title: "Язык",
  }
] as const;
