"use client";

import { useTranslations } from 'next-intl';
import { Suspense, useState } from 'react';
import Hero3D from './components/Hero3D';
import BackgroundCanvas from './components/BackgroundCanvas';
import PartnerCarousel from './components/PartnerCarousel';
import ContactForm from './components/ContactForm';
import MissionValues from './components/MissionValues';
import ProductCategories from './components/ProductCategories';
import ServicesTimeline from './components/ServicesTimeline';
import StatsSection from './components/StatsSection';
import GallerySection from './components/GallerySection';
import CTASection from './components/CTASection';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animations for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  const t = useTranslations();
  
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Luxury Animated Background */}
      <BackgroundCanvas />
      
      {/* Hero Section with 3D Animation */}
      <HeroSection />
      
      {/* Trusted By Section with Logo Carousel */}
      <TrustedBySection />
      
      {/* Company Buildings Gallery */}
      <GallerySection />
      
      {/* Mission & Values Section */}
      <MissionValues />
      
      {/* Product Categories Overview */}
      <ProductCategories />
      
      {/* Services & Training Timeline */}
      <ServicesTimeline />
      
      {/* Enhanced Statistics */}
      <StatsSection />
      
      {/* Call to Action section removed */}
      
      {/* Premium Contact Section */}
      <ContactSection />
    </main>
  );
}

// Hero Section with Overlay Content
function HeroSection() {
  return (
    <section className="relative h-[70vh] md:h-[75vh] lg:h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {/* Hero3D Component */}
      <div className="absolute inset-0 z-10 w-full">
        <Hero3D />
      </div>
    </section>
  );
}

// Trusted By Section with Logo Carousel
function TrustedBySection() {
  const t = useTranslations('trusted');
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  
  return (
    <section className="py-2 md:py-4 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-2 md:mb-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="inline-block relative">
            <h2 className="text-lg md:text-xl lg:text-2xl font-medium tracking-wide relative z-10 font-montserrat transition-all duration-300">
              <span className="text-white/70">{t('trustedBy')} </span>
              <span 
                className={`transition-all duration-300 cursor-pointer ${isCarouselHovered ? 'bg-gradient-to-r from-white via-blue-300 to-millo-blue bg-clip-text text-transparent' : 'text-white/70 hover:bg-gradient-to-r hover:from-white hover:via-blue-300 hover:to-millo-blue hover:bg-clip-text hover:text-transparent'}`}
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
              >
                {t('worldIndustryLeaders')}
              </span>
            </h2>
            {/* Subtle decorative line */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-millo-blue/60 to-transparent"></div>
          </div>
        </motion.div>
        
        <PartnerCarousel onHoverChange={setIsCarouselHovered} />
      </div>
    </section>
  );
}

// Premium Contact Section
function ContactSection() {
  const t = useTranslations('contact.getInTouch');
  
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('title')}</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="space-y-8"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">{t('contactInfo.title')}</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-millo-blue/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-millo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">{t('contactInfo.address.label')}</p>
                    <p className="text-white font-medium">{t('contactInfo.address.value')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-millo-red/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-millo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">{t('contactInfo.phone.label')}</p>
                    <p className="text-white font-medium">{t('contactInfo.phone.value')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-millo-blue/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-millo-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">{t('contactInfo.email.label')}</p>
                    <p className="text-white font-medium">{t('contactInfo.email.value')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
