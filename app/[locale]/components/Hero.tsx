"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Hero() {
  const t = useTranslations('hero');
  
  return (
    <section className="relative py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('title')}
          </h1>
          <div className="h-1 w-20 bg-millo-red mx-auto mb-6"></div>
          <p className="text-lg md:text-xl mb-8">
            {t('subtitle')}
          </p>
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center px-8 py-3 font-medium tracking-wider text-white rounded-md bg-millo-red hover:bg-red-700 transition-colors duration-300 ease-out"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
