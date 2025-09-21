import {getRequestConfig} from 'next-intl/server';

// Define the locales supported by your application
export const locales = ['sq', 'en'];
export const defaultLocale = 'sq';

// This is the configuration for next-intl
// used in the App Router.
export default getRequestConfig(async ({locale}) => {
  // Ensure locale is a valid string, defaulting to 'sq' if somehow undefined
  const currentLocale = locale || defaultLocale;
  
  // Load messages for the requested locale
  return {
    locale: currentLocale as string,
    messages: (await import(`./messages/${currentLocale}/index.json`)).default
  };
});
