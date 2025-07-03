'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../components/ThemeProvider';

export default function BrandsPage() {
  const t = useTranslations('brands');
  const { prefersReducedMotion } = useTheme();
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

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

  // Brand list (would come from a database in a real application)
  const brands = [
    {
      id: 1,
      name: t('brand1.name'),
      description: t('brand1.description'),
      fullDescription: t('brand1.fullDescription'),
      logo: '/brands/brand1.svg',
      image: '/brands/brand1-hero.jpg',
      features: [
        t('brand1.features.feature1'),
        t('brand1.features.feature2'),
        t('brand1.features.feature3')
      ]
    },
    {
      id: 2,
      name: t('brand2.name'),
      description: t('brand2.description'),
      fullDescription: t('brand2.fullDescription'),
      logo: '/brands/brand2.svg',
      image: '/brands/brand2-hero.jpg',
      features: [
        t('brand2.features.feature1'),
        t('brand2.features.feature2'),
        t('brand2.features.feature3')
      ]
    },
    {
      id: 3,
      name: t('brand3.name'),
      description: t('brand3.description'),
      fullDescription: t('brand3.fullDescription'),
      logo: '/brands/brand3.svg',
      image: '/brands/brand3-hero.jpg',
      features: [
        t('brand3.features.feature1'),
        t('brand3.features.feature2'),
        t('brand3.features.feature3')
      ]
    },
    {
      id: 4,
      name: t('brand4.name'),
      description: t('brand4.description'),
      fullDescription: t('brand4.fullDescription'),
      logo: '/brands/brand4.svg',
      image: '/brands/brand4-hero.jpg',
      features: [
        t('brand4.features.feature1'),
        t('brand4.features.feature2'),
        t('brand4.features.feature3')
      ]
    }
  ];

  const selectedBrandDetails = selectedBrand !== null ? brands.find(brand => brand.id === selectedBrand) : null;

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
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

        {/* Brand Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
              onClick={() => setSelectedBrand(brand.id)}
            >
              <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-6">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{brand.description}</p>
                <button 
                  className="text-millo-red font-medium hover:underline focus:outline-none flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBrand(brand.id);
                  }}
                >
                  {t('learnMore')}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Brand Partnerships */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-50 dark:bg-gray-800/50 p-10 md:p-16 rounded-2xl mb-16"
        >
          <h2 className="text-3xl font-bold mb-10 text-center">{t('partnerships.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                <img 
                  src={`/brands/partner${i}.svg`} 
                  alt={t(`partnerships.partner${i}`)}
                  className="max-h-16" 
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Selected Brand Details Modal */}
        {selectedBrandDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBrand(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-80">
                <img 
                  src={selectedBrandDetails.image} 
                  alt={selectedBrandDetails.name}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-8">
                    <img 
                      src={selectedBrandDetails.logo} 
                      alt={selectedBrandDetails.name}
                      className="h-16 mb-4" 
                    />
                    <h2 className="text-3xl font-bold text-white">{selectedBrandDetails.name}</h2>
                  </div>
                </div>
                <button
                  className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  onClick={() => setSelectedBrand(null)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  {selectedBrandDetails.fullDescription}
                </p>
                <h3 className="text-xl font-bold mb-4">{t('keyFeatures')}</h3>
                <ul className="space-y-3 mb-8">
                  {selectedBrandDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-millo-red mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center">
                  <a 
                    href={`/products?brand=${selectedBrandDetails.id}`}
                    className="bg-millo-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                  >
                    {t('viewProducts')}
                  </a>
                  <button 
                    onClick={() => setSelectedBrand(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {t('close')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Global Distribution */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">{t('global.title')}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            {t('global.description')}
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 h-80 rounded-xl flex items-center justify-center mb-12">
            <p className="text-gray-500 dark:text-gray-400">{t('global.mapPlaceholder')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['europe', 'americas', 'asia'].map((region) => (
              <div key={region} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-3">{t(`global.regions.${region}.name`)}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{t(`global.regions.${region}.description`)}</p>
                <p className="font-medium">{t(`global.regions.${region}.countries`)}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
      
      <Footer />
    </>
  );
}
