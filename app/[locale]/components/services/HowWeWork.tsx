/**
 * HowWeWork Component
 * 
 * Displays the 4-step process of how MilloColor works with clients
 * in an elegant timeline format.
 */

'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const steps = [
  { key: 'assess', icon: '🔍' },
  { key: 'recommend', icon: '💡' },
  { key: 'implement', icon: '⚡' },
  { key: 'support', icon: '🤝' }
];

export default function HowWeWork() {
  const t = useTranslations('services.howWeWork');

  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center"
        >
          {/* Section Header */}
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
            className="text-lg text-white/70 max-w-3xl mx-auto mb-12"
          >
            {t('subtitle')}
          </motion.p>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-millo-blue rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                  {index + 1}
                </div>

                {/* Step Card */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 pt-8 h-full">
                  {/* Icon */}
                  <div className="text-4xl mb-4">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t(`steps.${step.key}.title`)}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-sm leading-relaxed">
                    {t(`steps.${step.key}.desc`)}
                  </p>
                </div>

                {/* Connector Line (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-millo-blue to-transparent transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}