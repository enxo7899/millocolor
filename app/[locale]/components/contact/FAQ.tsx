'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQ() {
  const t = useTranslations('contact.faq');
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqItems: FAQItem[] = [
    {
      id: 'q1',
      question: t('items.q1.question'),
      answer: t('items.q1.answer')
    },
    {
      id: 'q2',
      question: t('items.q2.question'),
      answer: t('items.q2.answer')
    },
    {
      id: 'q3',
      question: t('items.q3.question'),
      answer: t('items.q3.answer')
    },
    {
      id: 'q4',
      question: t('items.q4.question'),
      answer: t('items.q4.answer')
    },
    {
      id: 'q5',
      question: t('items.q5.question'),
      answer: t('items.q5.answer')
    },
    {
      id: 'q6',
      question: t('items.q6.question'),
      answer: t('items.q6.answer')
    }
  ];

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => (
        <motion.div
          key={item.id}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          <motion.button
            onClick={() => toggleItem(item.id)}
            className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <h3 className="text-lg font-semibold text-white pr-4">
              {item.question}
            </h3>
            <motion.div
              animate={{ rotate: openItem === item.id ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDownIcon className="w-5 h-5 text-millo-blue flex-shrink-0" />
            </motion.div>
          </motion.button>
          
          <AnimatePresence>
            {openItem === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5">
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-white/70 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}