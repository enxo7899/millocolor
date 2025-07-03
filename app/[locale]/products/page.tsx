'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../components/ThemeProvider';

// Define product category type
type Category = 'all' | 'basecoats' | 'clearcoats' | 'topcoats' | 'additives' | 'accessories';

export default function ProductsPage() {
  const t = useTranslations('products');
  const { prefersReducedMotion } = useTheme();
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Product list (would come from a database in a real application)
  const products = [
    {
      id: 1,
      name: t('product1.name'),
      description: t('product1.description'),
      category: 'basecoats',
      image: '/products/basecoat1.jpg',
    },
    {
      id: 2,
      name: t('product2.name'),
      description: t('product2.description'),
      category: 'clearcoats',
      image: '/products/clearcoat1.jpg',
    },
    {
      id: 3,
      name: t('product3.name'),
      description: t('product3.description'),
      category: 'topcoats',
      image: '/products/topcoat1.jpg',
    },
    {
      id: 4,
      name: t('product4.name'),
      description: t('product4.description'),
      category: 'additives',
      image: '/products/additive1.jpg',
    },
    {
      id: 5,
      name: t('product5.name'),
      description: t('product5.description'),
      category: 'accessories',
      image: '/products/accessory1.jpg',
    },
    {
      id: 6,
      name: t('product6.name'),
      description: t('product6.description'),
      category: 'basecoats',
      image: '/products/basecoat2.jpg',
    },
  ];

  // Filter products based on active category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
        <section className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {(['all', 'basecoats', 'clearcoats', 'topcoats', 'additives', 'accessories'] as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category 
                    ? 'bg-millo-red text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </motion.div>

          {/* Products Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-millo-red text-white text-sm font-bold py-1 px-3 rounded-full">
                    {t(`categories.${product.category}`)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
                  <button className="text-millo-red font-medium hover:underline focus:outline-none flex items-center">
                    {t('learnMore')}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-24 bg-gradient-to-r from-millo-blue to-millo-red p-10 md:p-16 rounded-2xl text-white text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('ctaTitle')}</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">{t('ctaText')}</p>
            <a 
              href="/contact" 
              className="inline-block bg-white text-millo-red font-bold py-4 px-8 rounded-lg transition-transform hover:scale-105 shadow-xl"
            >
              {t('ctaButton')}
            </a>
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
