export const locales = ['en', 'sq'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

// Use the default path-based routing 
export const localePrefix = 'as-needed';

export function getTranslations(locale: Locale) {
  return import(`../../public/locales/${locale}/common.json`);
}
