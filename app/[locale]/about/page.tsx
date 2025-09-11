'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundCanvas from '../components/BackgroundCanvas';
import PartnerCarousel from '../components/PartnerCarousel';
import TypewriterText from '../components/TypewriterText';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations('about');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <>
      <Header />
      
      <main className="min-h-screen relative overflow-hidden" ref={containerRef}>
        {/* Luxury Animated Background */}
        <BackgroundCanvas />
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Mission Section */}
        <MissionSection />
        
        {/* What We Offer Section */}
        <WhatWeOfferSection />
        
        {/* Commitment Section */}
        <CommitmentSection />
        
        {/* Reach Section */}
        <ReachSection />
        
        {/* Partnership Section */}
        <PartnershipSection />
        
        {/* Brand Showcase */}
        <BrandShowcaseSection />
      </main>
      
      <Footer />
    </>
  );
}

// Hero Section with Animated Headlines
function HeroSection() {
  const t = useTranslations('about');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[100vh] sm:h-[90vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-0">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes - Hidden on mobile for better performance */}
        <motion.div
          className="hidden sm:block absolute top-20 left-10 w-32 h-32 border border-millo-blue/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="hidden sm:block absolute top-40 right-20 w-24 h-24 bg-millo-red/10 rounded-lg"
          animate={{
            y: [0, 30, 0],
            rotate: [0, -90, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="hidden sm:block absolute bottom-32 left-1/4 w-16 h-16 border-2 border-millo-blue/30 rounded-full"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-8"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3">
              <span className="text-millo-blue font-semibold text-sm tracking-wide uppercase">
                {t('established')}
              </span>
            </div>
          </motion.div>

          {/* Main Title with Typewriter Effect */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8"
          >
            <span className="text-white">
              {t('hero.title')}
            </span>
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mb-4 sm:mb-6 md:mb-8"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 font-light max-w-4xl mx-auto leading-relaxed px-4">
              <TypewriterText
                strings={[t('hero.subtitle')]}
                colors={['#ffffff']}
                className="font-montserrat"
              />
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10 md:mb-12 px-4"
          >
            {t('hero.description')}
          </motion.p>

          {/* Key Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4"
          >
            {[
              { key: 'authorizedDealer', icon: '🏆' },
              { key: 'worldReputableBrands', icon: '🌍' },
              { key: 'strongReputation', icon: '⭐' }
            ].map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <p className="text-white/80 font-medium text-xs sm:text-sm">
                  {t(item.key)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

// Mission Section
function MissionSection() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <div className="mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              {t('mission.title')}
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-24 h-1 bg-gradient-to-r from-millo-blue to-millo-red mx-auto mb-8"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12"
          >
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {t('mission.description')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// What We Offer Section
function WhatWeOfferSection() {
  const t = useTranslations('about');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const offerings = [
    {
      id: 'premiumPaints',
      icon: '🎨',
      gradient: 'from-blue-500 to-blue-700',
      hoverGradient: 'from-blue-400 to-blue-600'
    },
    {
      id: 'auxiliaryMaterials',
      icon: '🔧',
      gradient: 'from-red-500 to-red-700',
      hoverGradient: 'from-red-400 to-red-600'
    },
    {
      id: 'equipment',
      icon: '⚙️',
      gradient: 'from-green-500 to-green-700',
      hoverGradient: 'from-green-400 to-green-600'
    }
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('whatWeOffer.title')}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {t('whatWeOffer.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offerings.map((offering, index) => (
            <motion.div
              key={offering.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onHoverStart={() => setHoveredCard(offering.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
            >
              <div className="relative h-96 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden cursor-pointer">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  hoveredCard === offering.id ? offering.hoverGradient : offering.gradient
                } opacity-10 transition-all duration-500`} />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-center">
                  {/* Icon */}
                  <motion.div
                    className="text-6xl mb-6"
                    animate={{
                      scale: hoveredCard === offering.id ? 1.2 : 1,
                      rotateY: hoveredCard === offering.id ? 360 : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {offering.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {t(`whatWeOffer.${offering.id}.title`)}
                  </h3>

                  {/* Description */}
                  <motion.p
                    className="text-white/70 leading-relaxed"
                    animate={{
                      opacity: hoveredCard === offering.id ? 1 : 0.7
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {t(`whatWeOffer.${offering.id}.description`)}
                  </motion.p>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />

                {/* Border glow effect */}
                {hoveredCard === offering.id && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)`,
                      backgroundSize: '400% 400%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Commitment Section
function CommitmentSection() {
  const t = useTranslations('about');

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t('commitment.title')}
              </h2>
              <p className="text-xl text-white/80 leading-relaxed">
                {t('commitment.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: '🎓', label: 'Training Programs' },
                    { icon: '💡', label: 'Expert Consulting' },
                    { icon: '🔬', label: 'Technical Support' },
                    { icon: '📚', label: 'Knowledge Transfer' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="text-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <p className="text-white/70 text-sm font-medium">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Reach Section
function ReachSection() {
  const t = useTranslations('about');

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('reach.title')}
          </h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 mb-12"
          >
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              {t('reach.description')}
            </p>
            
            {/* Location indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { country: 'Belgium', flag: '🇧🇪', distance: 'Strategic' },
                { country: 'Germany', flag: '🇩🇪', distance: 'Premium' },
                { country: 'Turkey', flag: '🇹🇷', distance: 'Regional' }
              ].map((location, index) => (
                <motion.div
                  key={location.country}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{location.flag}</div>
                  <h3 className="text-white font-semibold mb-1">{location.country}</h3>
                  <p className="text-white/60 text-sm">{location.distance} Partner</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Partnership Section
function PartnershipSection() {
  const t = useTranslations('about');

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('partnership.title')}
          </h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-millo-blue/20 to-millo-red/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12"
          >
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {t('partnership.description')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Brand Showcase Section
function BrandShowcaseSection() {
  const t = useTranslations('trusted');
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('trustedBy')} {t('worldIndustryLeaders')}
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Trusted partnerships with the world&apos;s most reputable brands in automotive refinishing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <PartnerCarousel onHoverChange={setIsCarouselHovered} />
        </motion.div>
      </div>
    </section>
  );
}