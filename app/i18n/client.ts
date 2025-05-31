import {createTranslator} from 'next-intl';

export function getTranslations(namespace: string, locale: string) {
  return import(`../../public/locales/${locale}/${namespace}.json`)
    .then((module) => module.default);
}

export async function getTranslator(locale: string, namespace: string) {
  const messages = await getTranslations(namespace, locale);
  return createTranslator({locale, messages});
}
