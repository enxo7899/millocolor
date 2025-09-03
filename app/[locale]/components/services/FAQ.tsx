/**
 * FAQ Component
 * 
 * Displays frequently asked questions in an accordion-style layout
 * with smooth animations and proper accessibility.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const faqItems = [
  'q1', 'q2', 'q3', 'q4', 'q5', 'q6'
];

export default function FAQ() {
  const t = useTranslations('services.faq');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (itemKey: string) => {
    setOpenItem(openItem === itemKey ? null : itemKey);
  };

  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-white/70">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqItems.map((itemKey, index) => (
              <motion.div
                key={itemKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleItem(itemKey)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors duration-300"
                  aria-expanded={openItem === itemKey}
                >
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {t(`items.${itemKey}.question`)}
                  </h3>
                  <motion.div
                    animate={{ rotate: openItem === itemKey ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 text-white/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openItem === itemKey && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <p className="text-white/70 leading-relaxed">
                          {t(`items.${itemKey}.answer`)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}