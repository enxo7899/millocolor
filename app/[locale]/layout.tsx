import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from './components/ThemeProvider';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { locales } from '@/i18n';
import '../globals.css';

// Import locales from i18n config

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  // Validate the locale to prevent access to non-supported locales
  // Use Promise.resolve to properly await the params object
  const locale = (await params).locale;
  
  // Verify that locale is supported first
  if (!locales.includes(locale as string)) {
    notFound();
  }

  // Load the translations
  const messages = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default);
  
  return {
    title: messages.site.title,
    description: messages.site.description,
    metadataBase: new URL('https://millocolor.com'),
    icons: {
      icon: [
        { url: '/favicon.ico?v=3', sizes: 'any' },
        { url: '/images/favicon.png?v=3', type: 'image/png', sizes: '32x32' },
        { url: '/images/favicon.png?v=3', type: 'image/png', sizes: '16x16' }
      ],
      shortcut: '/favicon.ico?v=3',
      apple: '/images/favicon.png?v=3',
    },
    alternates: {
      canonical: '/',
      languages: {
        'sq': '/sq',
        'en': '/en',
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
  params: Promise<{ locale: string }>;
}) {
  // Use Promise.resolve to properly await the params object
  const locale = (await params).locale;

  // Validate that the incoming locale is supported
  if (!locales.includes(locale as string)) {
    return notFound();
  }

  // Load translations for the current locale
  const messages = await import(`../../messages/${locale}/index.json`)
    .then((module) => module.default);

  return (
    <>
      <head>
        <link rel="icon" href="/favicon.ico?v=3" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png?v=3" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png?v=3" />
        <link rel="apple-touch-icon" href="/images/favicon.png?v=3" />
      </head>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </NextIntlClientProvider>
      
      {/* Vercel Speed Insights */}
      <SpeedInsights />
      
      {/* Vercel Analytics */}
      <Analytics />
      
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
