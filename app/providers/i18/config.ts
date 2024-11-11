export type LocaleType = keyof typeof localeMap;

export const localeMap = {
  ru: "ru",
} as const;

export const localeList = [
  {
    lang: localeMap.ru,
    label: "Русский",
    icon: "🇷🇺",
    title: "Язык",
  },
] as const;
