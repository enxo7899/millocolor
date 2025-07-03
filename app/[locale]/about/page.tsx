'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  const t = useTranslations('about');

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-12 md:py-16 lg:py-24">
        <section className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold mb-6">{t('history.title')}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('history.paragraph1')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t('history.paragraph2')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-full min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <img 
                src="/images/placeholder.svg" 
                alt={t('history.imageAlt')}
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-lg mb-16"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">{t('mission.title')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              {t('mission.paragraph')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3 text-millo-red">{t(`mission.values.value${i}.title`)}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{t(`mission.values.value${i}.description`)}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-full min-h-[300px] md:min-h-[400px] rounded-lg overflow-hidden shadow-xl order-2 md:order-1"
            >
              <img 
                src="/images/placeholder.svg" 
                alt={t('team.imageAlt')}
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center order-1 md:order-2"
            >
              <h2 className="text-3xl font-bold mb-6">{t('team.title')}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t('team.paragraph1')}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {t('team.paragraph2')}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">{t('future.title')}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              {t('future.paragraph')}
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-millo-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              {t('future.cta')}
            </a>
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
