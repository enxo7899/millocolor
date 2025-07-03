import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import Header from './components/Header';
import Footer from './components/Footer';
import Script from 'next/script';
import { locales } from '@/i18n';
import '../globals.css';

// Import locales from i18n config

export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  // Validate the locale to prevent access to non-supported locales
  // Use Promise.resolve to properly await the params object
  const locale = (await Promise.resolve(params)).locale;
  
  // Verify that locale is supported first
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Load the translations
  const messages = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default);
  
  return {
    title: messages.site.title,
    description: messages.site.description,
    metadataBase: new URL('https://millocolor.com'),
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'sq': '/sq',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: 'https://millocolor.com',
      title: messages.site.title,
      description: messages.site.description,
      siteName: 'MilloColor',
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.site.title,
      description: messages.site.description,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Use Promise.resolve to properly await the params object
  const locale = (await Promise.resolve(params)).locale;

  // Validate that the incoming locale is supported
  if (!locales.includes(locale as any)) {
    return notFound();
  }

  // Load translations for the current locale
  const messages = await import(`../../messages/${locale}/index.json`)
    .then((module) => module.default);

  return (
    <>
      <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
      </NextIntlClientProvider>
      
      {/* Analytics Script - Load only after user consent */}
      <Script
        id="cookie-consent"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Cookie consent functionality will be implemented here
            console.log('Cookie consent script loaded');
          `,
        }}
      />
    </>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
