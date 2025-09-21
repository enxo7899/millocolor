/**
 * Brands Page
 * 
 * A luxury, modern, and minimalist page showcasing our partner brands.
 * Features responsive grid layout with all brands displayed.
 * 
 * To add/edit a brand:
 * 1. Update the brands array in data/brands.ts
 * 2. Add translations to messages/en/index.json and messages/sq/index.json
 * 3. Ensure the logo exists in /public/images/partners/ (optional)
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import BackgroundCanvas from '../components/BackgroundCanvas';
import { brands, type Brand } from '../../../data/brands';

export default function BrandsPage() {
  const t = useTranslations('brands');

  // Sort brands alphabetically
  const sortedBrands = brands.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      
      <main className="min-h-screen relative overflow-hidden">
        {/* Luxury Animated Background */}
        <BackgroundCanvas />
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Brands Grid */}
        <BrandsGrid brands={sortedBrands} />
      </main>
      
    </>
  );
}

// Hero Section
function HeroSection() {
  const t = useTranslations('brands');
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section className="relative min-h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-0">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6"
          >
            <span className="text-white">
              {t('hero.title')}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed px-4"
          >
            {t('hero.subtitle')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}



// Brands Grid
interface BrandsGridProps {
  brands: Brand[];
}

function BrandsGrid({ brands }: BrandsGridProps) {
  const t = useTranslations('brands');

  return (
    <section className="py-4 sm:py-2 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  layout: { duration: 0.3 }
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <BrandCard brand={brand} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// Brand Card Component
interface BrandCardProps {
  brand: Brand;
}

function BrandCard({ brand }: BrandCardProps) {
  const t = useTranslations('brands');

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 h-full flex flex-col hover:bg-white/10 transition-all duration-300 group cursor-pointer">
      {/* Logo Section */}
      <div className="h-16 sm:h-20 mb-3 sm:mb-4 flex items-center justify-center">
        {brand.logoSrc ? (
          <div className="relative w-full h-full">
            <Image
              src={brand.logoSrc}
              alt={brand.name}
              fill
              className="object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white/60">
              {brand.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Brand Name */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-millo-blue transition-colors duration-300">
          {brand.name}
        </h3>

        {/* Description */}
        <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-1">
          {t(`brandDescriptions.${brand.slug}.description`)}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {brand.categories.map((category) => (
            <span
              key={category}
              className="px-2 sm:px-3 py-1 bg-white/10 rounded-full text-xs text-white/70"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Country */}
        {brand.country && (
          <p className="text-white/50 text-xs mb-3 sm:mb-4">
            {brand.country}
          </p>
        )}

        {/* Website Link */}
        {brand.website && (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-millo-blue hover:text-millo-red transition-colors duration-300 text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {t('brandCard.visitWebsite')}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

