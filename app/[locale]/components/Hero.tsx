"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// Animation variants for text elements
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1]
    }
  })
};

// Animation variants for the CTA button
const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      delay: 0.8, 
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1]
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  tap: {
    scale: 0.95
  }
};

// Animation variants for the scroll hint
const scrollHintVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 1.5,
      duration: 0.5
    }
  }
};

export default function Hero() {
  const t = useTranslations('hero');
  // State to track if reduced motion is preferred
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // For parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  
  // Handle video load event
  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return (
    <section ref={sectionRef} className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden">
      {/* Full-screen video background with fallback image */}
      <motion.div 
        className="absolute inset-0 z-0 w-full h-full"
        style={prefersReducedMotion ? {} : { scale }}
      >
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={handleVideoLoad}
            className={`object-cover object-center w-full h-full ${isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
          >
            <source src="/videos/paint-flow.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Fallback image while video loads */}
          <Image
            src="/hero-background.jpg"
            alt="Premium automotive paint"
            fill
            priority
            className={`object-cover object-center ${isVideoLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAFAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAABAUGB//EACEQAAIBAwQDAQAAAAAAAAAAAAECAwQFEQAGEiFhQRMU/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwX/xAAcEQACAQUBAAAAAAAAAAAAAAAAAQIDERIhMUH/2gAMAwEAAhEDEQA/AL3E7FTbuYVZGvCF1qqcKZBmJiOSEgdHAA5jPo51mtPMn6nNPSQkDw0cLk/cM40u77/FXU0NwO5t2Q08NJwqPooY3ZF4g8uJwc574PWOxkNv7guO2abcVDXQ189YwnkSNSoILEk9gnz50AVZY0NTUlaHQ//Z"
          />
        </div>
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10"></div>
      </motion.div>
      
      {/* Hero Content */}
      <motion.div 
        className="container mx-auto px-4 relative z-20 text-center text-white"
        style={prefersReducedMotion ? {} : { y, opacity }}
      >
        <motion.div
          className="flex flex-col items-center space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-2 leading-tight tracking-tight"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={prefersReducedMotion ? {} : textVariants}
          >
            {t('title')}
          </motion.h1>
          
          <motion.div
            className="h-1 w-20 bg-millo-red mx-auto my-4"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
          
          <motion.p 
            className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-200 font-light"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={prefersReducedMotion ? {} : textVariants}
          >
            {t('subtitle')}
          </motion.p>
          
          <motion.div
            className="mt-8"
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            variants={prefersReducedMotion ? {} : buttonVariants}
          >
            <Link href="/en/products" className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-medium tracking-wider text-white rounded-md bg-millo-red hover:bg-red-700 transition-colors duration-300 ease-out">
              <span className="absolute inset-0 w-full h-full bg-millo-red group-hover:bg-red-700 transition-all duration-300 ease-out"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-0 transition-all duration-300 origin-top-left transform -rotate-45 translate-x-24 bg-white opacity-10 group-hover:h-64 group-hover:-translate-y-10"></span>
              <span className="relative">{t('cta')}</span>
            </Link>
          </motion.div>
          
          {/* Scroll Hint */}
          <motion.div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            initial="hidden"
            animate="visible"
            variants={prefersReducedMotion ? {} : scrollHintVariants}
          >
            <p className="text-sm text-gray-300 uppercase tracking-widest mb-2">{t('scrollHint')}</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
            >
              <svg 
                className="w-8 h-8 text-white mx-auto" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated particles for paint drop effect */}
      <div className="paint-particles absolute inset-0 z-10 pointer-events-none"></div>
    </section>
  );
}
