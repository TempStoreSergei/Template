export type LocaleType = keyof typeof localeMap;

export const localeMap = {
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
