'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const ProductCategories = () => {
  const t = useTranslations('productCategories');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const categories = [
    {
      id: 'premium-paints',
      title: t('categories.premium.title'),
      icon: '🎨',
      shortDescription: t('categories.premium.shortDescription'),
      fullDescription: t('categories.premium.fullDescription'),
      features: t.raw('categories.premium.features') as string[],
      image: '/images/products/cromax-vr-1120.jpg',
      color: 'from-millo-blue to-blue-700'
    },
    {
      id: 'auxiliary',
      title: t('categories.auxiliary.title'),
      icon: '🧪',
      shortDescription: t('categories.auxiliary.shortDescription'),
      fullDescription: t('categories.auxiliary.fullDescription'),
      features: t.raw('categories.auxiliary.features') as string[],
      image: '/images/products/troton-light-putty.jpg',
      color: 'from-millo-red to-red-700'
    },
    {
      id: 'equipment',
      title: t('categories.equipment.title'),
      icon: '🔧',
      shortDescription: t('categories.equipment.shortDescription'),
      fullDescription: t('categories.equipment.fullDescription'),
      features: t.raw('categories.equipment.features') as string[],
      image: '/images/products/telwin-smart-inductor-5000.jpg',
      color: 'from-green-600 to-green-700'
    }
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Card */}
              <div 
                className={`relative overflow-hidden rounded-2xl border border-white/10 cursor-pointer transition-all duration-500 ${
                  expandedCard === category.id 
                    ? 'bg-white/10 backdrop-blur-md h-auto' 
                    : 'bg-white/5 backdrop-blur-md h-80 hover:h-96'
                }`}
                onClick={() => setExpandedCard(expandedCard === category.id ? null : category.id)}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`} />

                {/* Content */}
                <div className="relative z-10 p-8">
                  {/* Icon */}
                  <motion.div
                    className="text-5xl mb-4"
                    animate={{
                      scale: expandedCard === category.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {category.title}
                  </h3>

                  {/* Short description */}
                  <p className="text-white/70 mb-4">
                    {category.shortDescription}
                  </p>

                  {/* Expandable content */}
                  <AnimatePresence>
                    {expandedCard === category.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {/* Full description */}
                        <p className="text-white/80 mb-6 leading-relaxed">
                          {category.fullDescription}
                        </p>

                        {/* Features */}
                        <div className="mb-6">
                          <h4 className="text-white font-semibold mb-3">{t('keyFeatures')}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {category.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                                <span className="text-white/70 text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href="/products"
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-millo-dark-blue text-white font-semibold rounded-full hover:bg-blue-800 hover:shadow-lg transition-all duration-300"
                        >
                          <span>{t('exploreProducts')}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expand indicator */}
                  <div className="mt-4 flex justify-center">
                    <motion.div
                      animate={{ rotate: expandedCard === category.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-6 h-6 text-white/50"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;