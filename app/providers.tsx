'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

type ProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: any;
};

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
