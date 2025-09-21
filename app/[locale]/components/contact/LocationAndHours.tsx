'use client';

import { motion, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { contactInfo } from '../../../../data/contact';
import MapPreview from './MapPreview';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: 'beforeChildren' }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function LocationAndHours() {
  const t = useTranslations('contact');

  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Map Preview */}
          <motion.div variants={itemVariants}>
            <MapPreview />
          </motion.div>

          {/* Location Info */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              {t('locations.title')}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-millo-blue/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-millo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t('locations.address')}</h3>
                  <p className="text-white/70">{contactInfo.address.full}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-millo-red/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-millo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t('hours.title')}</h3>
                  <div className="text-white/70 space-y-1">
                    <p>{contactInfo.hours.weekdays}</p>
                    <p>{contactInfo.hours.saturday}</p>
                    <p>{contactInfo.hours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


