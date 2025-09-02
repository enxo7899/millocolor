'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundCanvas from '../components/BackgroundCanvas';
import ProductShowcase from '../components/ProductShowcase';

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CheckBadgeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

// Define product category type
type Category = 'all' | 'premium' | 'professional' | 'specialty' | 'eco' | 'industrial' | 'custom';

export default function ProductsPage() {
  const t = useTranslations();
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const categories = [
    { key: 'all', icon: '🎨' },
    { key: 'premium', icon: '⭐' },
    { key: 'professional', icon: '🔧' },
    { key: 'specialty', icon: '✨' },
    { key: 'eco', icon: '🌱' },
    { key: 'industrial', icon: '🏭' },
    { key: 'custom', icon: '🎯' }
  ] as const;

  return (
    <>
      <Header />
      
      <main className="min-h-screen relative overflow-hidden">
        {/* Luxury Animated Background (full page) */}
        <BackgroundCanvas />
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24">
          <div className="container mx-auto px-4">
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center max-w-5xl mx-auto"
            >
              <div className="inline-block relative mb-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-montserrat">
                  {t('products.title')}
                </h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-millo-blue via-millo-red to-millo-gold rounded-full"></div>
              </div>
              
              <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-4xl mx-auto">
                {t('products.subtitle')}
              </p>

              {/* Category Filters */}
              <motion.div 
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex flex-wrap gap-3 justify-center">
                  {categories.map((category) => (
                    <motion.button
                      key={category.key}
                      onClick={() => setActiveCategory(category.key)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                        activeCategory === category.key
                          ? 'bg-gradient-to-r from-millo-blue to-millo-red text-white shadow-lg' 
                          : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span>{t(`productShowcase.categories.${category.key}`)}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Product Showcase Section */}
        <ProductShowcase isHomepage={false} />

        {/* Features & Benefits Section */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-montserrat">
                {t('products.whyChooseUs') || 'Why Choose MilloColor?'}
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                {t('products.whyChooseUsSubtitle') || 'Discover what sets our products apart in the automotive refinishing industry.'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: <CheckBadgeIcon className="w-8 h-8" />,
                  title: t('products.benefits.quality.title') || 'Premium Quality',
                  description: t('products.benefits.quality.description') || 'European-grade formulations with rigorous quality control standards.'
                },
                {
                  icon: <StarIcon className="w-8 h-8" />,
                  title: t('products.benefits.performance.title') || 'Superior Performance',
                  description: t('products.benefits.performance.description') || 'Exceptional durability, color accuracy, and finish consistency.'
                },
                {
                  icon: '🎯',
                  title: t('products.benefits.precision.title') || 'Color Precision',
                  description: t('products.benefits.precision.description') || 'Advanced color matching technology for perfect results every time.'
                },
                {
                  icon: '🌍',
                  title: t('products.benefits.global.title') || 'Global Standards',
                  description: t('products.benefits.global.description') || 'Meeting international automotive industry standards and regulations.'
                },
                {
                  icon: '🔬',
                  title: t('products.benefits.innovation.title') || 'Innovation',
                  description: t('products.benefits.innovation.description') || 'Cutting-edge formulations with the latest automotive coating technologies.'
                },
                {
                  icon: '🤝',
                  title: t('products.benefits.support.title') || 'Expert Support',
                  description: t('products.benefits.support.description') || 'Comprehensive technical support and training from industry experts.'
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-millo-blue to-millo-red rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    {typeof benefit.icon === 'string' ? (
                      <span className="text-2xl">{benefit.icon}</span>
                    ) : (
                      <div className="text-white">{benefit.icon}</div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 font-montserrat">
                    {benefit.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              className="bg-gradient-to-r from-millo-blue via-millo-red to-millo-blue bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-1000 rounded-3xl p-12 md:p-16 text-center shadow-2xl max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-montserrat">
                {t('products.ctaTitle')}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t('products.ctaText')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center bg-white text-millo-red font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all font-montserrat"
                >
                  {t('products.ctaButton')}
                </motion.a>
                <motion.a
                  href="/brands"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-millo-red transition-all font-montserrat"
                >
                  {t('products.viewBrands') || 'View Our Brands'}
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 -right-64 w-96 h-96 bg-millo-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 -left-64 w-96 h-96 bg-millo-red/10 rounded-full blur-3xl"></div>
          <div className="absolute top-2/3 right-1/4 w-32 h-32 bg-millo-gold/20 rounded-full blur-2xl"></div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
