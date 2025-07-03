'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTheme } from '../components/ThemeProvider';

export default function ServicesPage() {
  const t = useTranslations('services');
  const { prefersReducedMotion } = useTheme();
  const [activeService, setActiveService] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, 100]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Service list
  const services = [
    {
      id: 1,
      name: t('colorConsulting.title'),
      shortDescription: t('colorConsulting.shortDescription'),
      description: t('colorConsulting.description'),
      benefits: [
        t('colorConsulting.benefits.benefit1'),
        t('colorConsulting.benefits.benefit2'),
        t('colorConsulting.benefits.benefit3')
      ],
      image: '/images/placeholder.svg',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      id: 2,
      name: t('training.title'),
      shortDescription: t('training.shortDescription'),
      description: t('training.description'),
      benefits: [
        t('training.benefits.benefit1'),
        t('training.benefits.benefit2'),
        t('training.benefits.benefit3')
      ],
      image: '/images/placeholder.svg',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    },
    {
      id: 3,
      name: t('equipment.title'),
      shortDescription: t('equipment.shortDescription'),
      description: t('equipment.description'),
      benefits: [
        t('equipment.benefits.benefit1'),
        t('equipment.benefits.benefit2'),
        t('equipment.benefits.benefit3')
      ],
      image: '/images/placeholder.svg',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 4,
      name: t('support.title'),
      shortDescription: t('support.shortDescription'),
      description: t('support.description'),
      benefits: [
        t('support.benefits.benefit1'),
        t('support.benefits.benefit2'),
        t('support.benefits.benefit3')
      ],
      image: '/images/placeholder.svg',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  const activeServiceDetails = activeService !== null ? services.find(service => service.id === activeService) : null;

  return (
    <>
      <Header />
      
      <main ref={containerRef} className="relative">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] bg-gradient-to-r from-millo-blue to-millo-red flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="container mx-auto px-4 relative z-20 text-white text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto"
            >
              {t('hero.subtitle')}
            </motion.p>
          </div>
        </section>
        
        {/* Services Overview */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('overview.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('overview.description')}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setActiveService(service.id)}
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white">{service.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-millo-red mb-4">
                    {service.icon}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{service.shortDescription}</p>
                  <button 
                    className="text-millo-red font-medium hover:underline focus:outline-none flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveService(service.id);
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
        </section>

        {/* Process Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              style={{ opacity, y }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('process.title')}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                {t('process.description')}
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              {[1, 2, 3, 4].map((step) => (
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, x: step % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex flex-col md:flex-row items-center mb-12 relative"
                >
                  {step > 1 && (
                    <div className="absolute top-0 left-8 md:left-1/2 md:-ml-1 h-full w-0.5 -z-10 bg-gradient-to-b from-millo-red to-millo-blue"></div>
                  )}
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-millo-red to-millo-blue rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 md:mb-0 z-10">
                    {step}
                  </div>
                  <div className="md:ml-8 md:flex-grow">
                    <h3 className="text-2xl font-bold mb-3">{t(`process.steps.step${step}.title`)}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{t(`process.steps.step${step}.description`)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('testimonials.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('testimonials.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">{t(`testimonials.testimonial${i}.name`)}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t(`testimonials.testimonial${i}.company`)}</p>
                  </div>
                </div>
                <div className="mb-4 text-yellow-500 flex">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">"{t(`testimonials.testimonial${i}.text`)}"</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-millo-blue to-millo-red py-16 md:py-24">
          <div className="container mx-auto px-4 text-center text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              {t('cta.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl max-w-3xl mx-auto mb-8"
            >
              {t('cta.description')}
            </motion.p>
            <motion.a
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              href="/contact"
              className="inline-block bg-white text-millo-red font-bold py-4 px-8 rounded-lg transition-transform hover:scale-105 shadow-xl"
            >
              {t('cta.button')}
            </motion.a>
          </div>
        </section>
      </main>
      
      {/* Service Details Modal */}
      {activeServiceDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setActiveService(null)}
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
                src={activeServiceDetails.image} 
                alt={activeServiceDetails.name}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8">
                  <div className="text-millo-red mb-4 bg-white/90 dark:bg-gray-800/90 rounded-full p-3 inline-block">
                    {activeServiceDetails.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-white">{activeServiceDetails.name}</h2>
                </div>
              </div>
              <button
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                onClick={() => setActiveService(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                {activeServiceDetails.description}
              </p>
              <h3 className="text-xl font-bold mb-4">{t('keyBenefits')}</h3>
              <ul className="space-y-3 mb-8">
                {activeServiceDetails.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-millo-red mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <a 
                  href="/contact"
                  className="bg-millo-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
                >
                  {t('inquire')}
                </a>
                <button 
                  onClick={() => setActiveService(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      <Footer />
    </>
  );
}
