/** @type {import('next-intl').NextIntlConfig} */
module.exports = {
  // Define locales that your application supports
  locales: ['en', 'sq'],
  
  // Set the default locale
  defaultLocale: 'en',
  
  // Define how to load messages
  localeDetection: true,

  // Load messages
  messages: async (locale) => {
    return (await import(`./public/locales/${locale}/common.json`)).default;
  }
};
