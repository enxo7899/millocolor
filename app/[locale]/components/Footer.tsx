"use client";

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-gradient-to-b from-[#0D0D0D] to-black text-white py-16 relative overflow-hidden">
      {/* Background elements removed */}
        
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] bg-repeat"></div>
      
      <motion.div 
        className="container mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and tagline */}
          <motion.div className="col-span-1 md:col-span-2" variants={itemVariants}>
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src={locale === 'en' ? '/images/logo_en.png' : '/images/logo_sq.png'}
                alt="MilloColor Logo"
                width={300}
                height={100}
                className="object-contain"
                priority
                quality={90}
              />
            </motion.div>
            <motion.p 
              className="mt-4 text-gray-300 max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {t('tagline')}
            </motion.p>
            <motion.div 
              className="mt-6 flex space-x-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <motion.a 
                href="https://www.facebook.com/millocolor1993/?locale=sq_AL" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
                whileHover={{ scale: 1.2, color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/millocolor/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
                whileHover={{ scale: 1.2, color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>
          
          {/* Quick links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-6 relative inline-block">
              {t('nav.title')}
              <motion.span 
                className="absolute -bottom-2 left-0 h-0.5 bg-millo-red" 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                  {tNav('products')}
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-gray-300 hover:text-white transition-colors">
                  {tNav('brands')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  {tNav('services')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-6 relative inline-block">
              {t('contact.title')}
              <motion.span 
                className="absolute -bottom-2 left-0 h-0.5 bg-millo-red" 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              />
            </h3>
            <address className="not-italic">
              <p className="text-gray-300 mb-2">Tiranë - Durrës km8</p>
              <p className="text-gray-300 mb-2">Tirana, Albania</p>
              <p className="text-gray-300 mb-2">
                <a href="mailto:info@millocolor.com" className="hover:text-white transition-colors">
                  info@millocolor.com
                </a>
              </p>
              <p className="text-gray-300">
                <a href="tel:+355686017350" className="hover:text-white transition-colors">
                  +355686017350
                </a>
              </p>
            </address>
          </motion.div>
        </div>
        
        {/* Newsletter */}
        <motion.div 
          className="mt-16 border-t border-gray-800/50 pt-12"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-lg mb-2">{t('newsletter.title')}</h3>
              <p className="text-gray-400">{t('newsletter.description')}</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  className="px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-millo-red"
                  required
                />
                <motion.button
                  type="submit"
                  className="px-6 py-2 bg-millo-red text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 overflow-hidden relative z-10 group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  <span className="relative">{t('newsletter.subscribe')}</span>
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
        
        {/* Copyright */}
        <motion.div 
          className="mt-12 border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p className="text-gray-400 text-sm">{t('rights')}</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy-policy" className="text-gray-400 text-sm hover:text-white transition-colors">
              {t('legal.privacy')}
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 text-sm hover:text-white transition-colors">
              {t('legal.terms')}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
