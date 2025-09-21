"use client";

import { useTranslations } from 'next-intl';
import { Suspense, useState } from 'react';
import HeroDynamicWrapper from './components/HeroDynamicWrapper';
import BackgroundCanvas from './components/BackgroundCanvas';
import PartnerCarousel from './components/PartnerCarousel';
// Removed ContactForm usage
import MissionValues from './components/MissionValues';
import ProductCategories from './components/ProductCategories';
import ProductShowcase from './components/ProductShowcase';
import ServicesTimeline from './components/ServicesTimeline';
import StatsSection from './components/StatsSection';
import GallerySection from './components/GallerySection';
import CTASection from './components/CTASection';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LocationAndHours from './components/contact/LocationAndHours';
import { generateContactLinks } from '../../data/contact';

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
      
      {/* Featured Products Showcase */}
      <ProductShowcase isHomepage={true} maxProducts={6} />
      
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
        <HeroDynamicWrapper />
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
  const tCta = useTranslations('contact.cta');
  
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
        
        {/* Reuse the contact page's Location & Hours block */}
        <LocationAndHours />

        {/* Reuse the contact page CTA banner */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              className="bg-gradient-to-r from-millo-blue/10 to-millo-red/10 rounded-2xl p-8 md:p-12 text-center border border-white/10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  {tCta('title')}
                </h2>
                <p className="text-white/70 mb-8 text-lg">
                  {tCta('subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href={generateContactLinks.whatsapp()} className="inline-flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-300">
                    WhatsApp
                  </Link>
                  <Link href={generateContactLinks.email()} className="inline-flex items-center gap-3 px-8 py-4 bg-millo-blue hover:bg-blue-600 text-white font-semibold rounded-full transition-all duration-300">
                    {tCta('emailButton')}
                  </Link>
                  <Link href={generateContactLinks.phone()} className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300 border border-white/20">
                    {tCta('callButton')}
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </section>
  );
}
