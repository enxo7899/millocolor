/**
 * Contact Page - MilloColor
 * 
 * Luxury contact page with static-friendly contact methods
 * Features: Email, Phone, WhatsApp CTAs + optional mailto form
 * 
 * To add/edit contact info: Update data/contact.ts
 * To modify translations: Update locales/en/index.json and locales/sq/index.json
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion, Variants } from 'framer-motion';
import { contactInfo, generateContactLinks } from '../../../data/contact';
import ActionCard from '../components/contact/ActionCard';
import MapPreview from '../components/contact/MapPreview';
import FAQ from '../components/contact/FAQ';

export default function ContactPage() {
  const t = useTranslations('contact');

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      
      <main className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          {/* Subtle background animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-millo-blue/5 via-transparent to-millo-red/5" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
          
          <motion.div
            className="container mx-auto px-4 relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center max-w-4xl mx-auto" variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="text-white">{t('hero.title')}</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              
              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href={generateContactLinks.email()}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-millo-blue hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-millo-blue/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('actions.email')}
                </motion.a>
                
                <motion.a
                  href={generateContactLinks.phone()}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-millo-red hover:bg-red-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-millo-red/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t('actions.call')}
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Quick Actions Grid */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <ActionCard
                icon="email"
                title={t('actions.email')}
                description={t('actions.emailDesc')}
                href={generateContactLinks.email()}
                variants={itemVariants}
              />
              
              <ActionCard
                icon="phone"
                title={t('actions.call')}
                description={t('actions.callDesc')}
                href={generateContactLinks.phone()}
                variants={itemVariants}
              />
              
              <ActionCard
                icon="whatsapp"
                title={t('actions.whatsapp')}
                description={t('actions.whatsappDesc')}
                href={generateContactLinks.whatsapp()}
                variants={itemVariants}
              />
            </motion.div>
          </div>
        </section>

        {/* Location & Hours */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
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


        {/* FAQ Section */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div className="text-center mb-12" variants={itemVariants}>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {t('faq.title')}
                </h2>
                <p className="text-white/70 text-lg">
                  {t('faq.subtitle')}
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FAQ />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              className="bg-gradient-to-r from-millo-blue/10 to-millo-red/10 rounded-2xl p-8 md:p-12 text-center border border-white/10"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {t('cta.title')}
                </h2>
                <p className="text-white/70 mb-8 text-lg">
                  {t('cta.subtitle')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href={generateContactLinks.whatsapp()}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-600/25"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp
                  </motion.a>
                  
                  <motion.a
                    href={generateContactLinks.email()}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-millo-blue hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('cta.emailButton')}
                  </motion.a>
                  
                  <motion.a
                    href={generateContactLinks.phone()}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('cta.callButton')}
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
    </>
  );
}