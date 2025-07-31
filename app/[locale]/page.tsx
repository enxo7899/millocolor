"use client";

import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import Hero3D from './components/Hero3D';
import BackgroundCanvas from './components/BackgroundCanvas';
import ProductCard from './components/ProductCard';
import StatCounter from './components/StatCounter';
import PartnerCarousel from './components/PartnerCarousel';
import ContactForm from './components/ContactForm';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animations for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};

export default function Home() {
  const t = useTranslations();
  
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Luxury Animated Background */}
      <BackgroundCanvas />
      
      {/* Hero Section with 3D Animation */}
      <HeroSection />
      
      {/* Premium Product Showcase */}
      <ProductShowcaseSection />
      
      {/* Animated Statistics */}
      <StatsSection />
      
      {/* Partner Logo Carousel */}
      <PartnersSection />
      
      {/* Premium Contact Section */}
      <ContactSection />
    </main>
  );
}

// Hero Section with Overlay Content
function HeroSection() {
  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
      {/* Aston Martin F1 Background */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/aston-martin-f1-hero-bg.jpg"
          alt="Aston Martin F1 Car Background"
          fill
          className="object-cover object-left md:object-bottom grayscale"
          priority
        />
      </div>
      
      {/* Hero3D Component */}
      <div className="absolute inset-0 z-10 w-full">
        <Hero3D />
      </div>
    </section>
  );
}

// Premium Product Showcase Section
function ProductShowcaseSection() {
  const t = useTranslations('showcase');
  
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Premium Product Lines</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Professional automotive paint solutions crafted for exceptional results
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard
            title="Premium Series"
            description="High-end automotive paints for luxury vehicle refinishing"
            features={["Superior color match", "Long-lasting durability", "Easy application"]}
            image="/images/products/premium.jpg"
          />
          
          <ProductCard
            title="Professional Series"
            description="Reliable solutions for everyday automotive painting needs"
            features={["Consistent quality", "Fast drying", "Cost-effective"]}
            image="/images/products/professional.jpg"
          />
          
          <ProductCard
            title="Specialty Series"
            description="Specialized coatings for unique automotive applications"
            features={["Custom colors", "Special effects", "Technical support"]}
            image="/images/products/specialty.jpg"
          />
        </div>
      </div>
    </section>
  );
}

// Animated Statistics Section
function StatsSection() {
  const t = useTranslations('stats');
  
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Trusted by automotive professionals across Europe
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCounter
            value={2500}
            label="Professional Customers"
            icon="👥"
            suffix="+"
          />
          
          <StatCounter
            value={15}
            label="Years Experience"
            icon="📅"
            suffix="+"
          />
          
          <StatCounter
            value={50000}
            label="Projects Completed"
            icon="🚗"
            suffix="+"
          />
          
          <StatCounter
            value={98}
            label="Customer Satisfaction"
            icon="⭐"
            suffix="%"
          />
        </div>
      </div>
    </section>
  );
}

// Partner Logo Carousel Section
function PartnersSection() {
  const t = useTranslations('partners');
  
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted Partners</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We represent leading European paint manufacturers known for quality and innovation
          </p>
        </motion.div>
        
        <PartnerCarousel />
      </div>
    </section>
  );
}

// Premium Contact Section
function ContactSection() {
  const t = useTranslations('contact');
  
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Ready to enhance your painting process? Contact our experts today
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <ContactForm />
          </motion.div>
          
          <motion.div 
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-millo-red rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Phone</h3>
                  <p className="text-white/70">+355 69 123 4567</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-millo-blue rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Email</h3>
                  <p className="text-white/70">info@millocolor.com</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-millo-gold rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Location</h3>
                  <p className="text-white/70">Tirana, Albania</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
