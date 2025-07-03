"use client";

import { useTranslations } from 'next-intl';
import { lazy, Suspense } from 'react';
import Hero3D from './components/Hero3D';
import Image from 'next/image';
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
  return (
    <main className="min-h-screen">
      <Hero3D />
      
      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Innovation in Color</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MilloColor is a leading distributor of premium automotive paint solutions with over three decades of experience.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="bg-gray-50 p-8 rounded-lg shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              custom={0}
            >
              <div className="w-16 h-16 bg-millo-red rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Premium Quality</h3>
              <p className="text-gray-600 text-center">
                We deliver exceptional color accuracy and finish quality through innovative products and technical expertise.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="bg-gray-50 p-8 rounded-lg shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              custom={1}
            >
              <div className="w-16 h-16 bg-millo-blue rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Technical Expertise</h3>
              <p className="text-gray-600 text-center">
                Our team provides expert training and consulting services to help you achieve perfect results.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="bg-gray-50 p-8 rounded-lg shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              custom={2}
            >
              <div className="w-16 h-16 bg-millo-gold rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Industry Partners</h3>
              <p className="text-gray-600 text-center">
                We represent leading European paint manufacturers known for their quality and innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Products/Brands Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premium Brands</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We represent leading European paint manufacturers known for their quality, innovation, and performance.
            </p>
          </motion.div>
          
          {/* Brands logo carousel */}
          <div className="overflow-hidden relative">
            <div className="flex space-x-16 animate-logo-scroll">
              {/* Replace with actual brand logos */}
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div 
                  key={index}
                  className="min-w-[150px] h-20 bg-white rounded-lg shadow-sm flex items-center justify-center"
                >
                  <div className="text-gray-400 font-bold">Brand {index}</div>
                </div>
              ))}
              
              {/* Duplicate logos for continuous scrolling */}
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div 
                  key={`duplicate-${index}`}
                  className="min-w-[150px] h-20 bg-white rounded-lg shadow-sm flex items-center justify-center"
                >
                  <div className="text-gray-400 font-bold">Brand {index}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <motion.button
              className="px-8 py-3 bg-millo-blue text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Products
            </motion.button>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer comprehensive support to help you achieve perfect results with our products.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <motion.div 
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src="/images/placeholder.svg"
                  alt="Technical Training"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Technical Training</h3>
                <p className="text-gray-600 mb-4">
                  Expert-led workshops and hands-on training sessions for automotive professionals.
                </p>
                <a href="#" className="text-millo-red font-medium hover:underline">Learn more →</a>
              </div>
            </motion.div>
            
            {/* Service 2 */}
            <motion.div 
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src="/images/placeholder.svg"
                  alt="Color Consulting"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Color Consulting</h3>
                <p className="text-gray-600 mb-4">
                  Personalized solutions for complex color matching challenges in automotive refinishing.
                </p>
                <a href="#" className="text-millo-red font-medium hover:underline">Learn more →</a>
              </div>
            </motion.div>
            
            {/* Service 3 */}
            <motion.div 
              className="bg-gray-50 rounded-lg overflow-hidden shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-48 bg-gray-200 relative">
                <Image
                  src="/images/placeholder.svg"
                  alt="Equipment Maintenance"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Equipment Maintenance</h3>
                <p className="text-gray-600 mb-4">
                  Professional servicing for paint application equipment to ensure optimal performance.
                </p>
                <a href="#" className="text-millo-red font-medium hover:underline">Learn more →</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-millo-blue text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to enhance your painting process?</h2>
            <p className="text-xl mb-8">
              Contact our team of experts today to discuss your specific needs and discover how our premium products can elevate your results.
            </p>
            <motion.button
              className="px-8 py-3 bg-white text-millo-blue rounded-md font-medium hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
