/**
 * Services Page
 * 
 * A luxury, modern, and minimalist page showcasing MilloColor's professional services.
 * Features responsive grid layout, service categories, and comprehensive information.
 * 
 * To add/edit a service:
 * 1. Update the services array in data/services.ts
 * 2. Add translations to messages/en/services.json and messages/sq/services.json
 * 3. Ensure the icon exists in the iconMap (ServiceCard.tsx)
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import BackgroundCanvas from '../components/BackgroundCanvas';
import ServiceCard from '../components/services/ServiceCard';
import HowWeWork from '../components/services/HowWeWork';
import FAQ from '../components/services/FAQ';
import { services, serviceCategories, getServicesByCategory, type Service } from '../../../data/services';

export default function ServicesPage() {
  const t = useTranslations('services');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = getServicesByCategory(selectedCategory);

  return (
    <>
      
      <main className="min-h-screen relative overflow-hidden">
        {/* Luxury Animated Background */}
        <BackgroundCanvas />
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Service Categories Filter */}
        <ServiceCategoriesFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        {/* Services Grid */}
        <ServicesGrid services={filteredServices} />
        
        {/* How We Work */}
        <HowWeWork />
        
        {/* Featured Brands */}
        <FeaturedBrands />
        
        {/* Training CTA */}
        <TrainingCTA />
        
        {/* FAQ */}
        <FAQ />
        
        {/* Contact Banner */}
        <ContactBanner />
      </main>
      
    </>
  );
}

// Hero Section
function HeroSection() {
  const t = useTranslations('services');

  return (
    <section className="relative min-h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-0">
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-white">
              {t('hero.title')}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed px-4"
          >
            {t('hero.subtitle')}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// Service Categories Filter
interface ServiceCategoriesFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

function ServiceCategoriesFilter({ selectedCategory, onCategoryChange }: ServiceCategoriesFilterProps) {
  const t = useTranslations('services');

  return (
    <section className="py-4 relative z-10 bg-gradient-to-b from-transparent to-black/50 border-t border-white/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {serviceCategories.map((category) => (
              <motion.button
                key={category.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category.key)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.key
                    ? 'bg-millo-blue text-white shadow-lg shadow-millo-blue/25'
                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {t(category.labelKey)}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Services Grid
interface ServicesGridProps {
  services: Service[];
}

function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <section className="py-6 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
        >
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Featured Brands
function FeaturedBrands() {
  const t = useTranslations('services.featuredBrands');

  const brands = [
    'Cromax', 'Standox', 'RUPES', 'Mirka', 'SATA', 'TELWIN', '3M', 'Hempel'
  ];

  return (
    <section className="py-16 relative z-10 bg-gradient-to-b from-transparent to-black/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {t('title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/70 mb-12"
          >
            {t('subtitle')}
          </motion.p>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
            {brands.map((brand, index) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-white/70 font-medium text-sm text-center">
                  {brand}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Training CTA
function TrainingCTA() {
  const t = useTranslations('services.trainingCta');

  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-millo-blue/20 to-millo-red/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              {t('title')}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-white/80 mb-8"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-millo-blue hover:bg-millo-blue/80 text-white px-8 py-4 rounded-full font-medium transition-colors duration-300"
              >
                {t('button')}
              </motion.button>
              
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-medium transition-colors duration-300"
                >
                  {t('contactButton')}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Contact Banner
function ContactBanner() {
  const t = useTranslations('services.contactBanner');

  return (
    <section className="py-16 relative z-10 bg-gradient-to-b from-transparent to-black/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            {t('title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/80 mb-8"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-millo-blue hover:bg-millo-blue/80 text-white px-8 py-4 rounded-full font-medium transition-colors duration-300"
              >
                {t('button')}
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}