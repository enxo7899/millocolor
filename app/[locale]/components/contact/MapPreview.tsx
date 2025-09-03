'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { generateContactLinks } from '../../../../data/contact';

export default function MapPreview() {
  const [showEmbed, setShowEmbed] = useState(false);

  return (
    <div className="relative">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        Our Location
      </h2>
      
      {!showEmbed ? (
        <motion.div
          className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Map placeholder with subtle animation */}
          <div className="aspect-video relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-millo-blue/10 to-millo-red/10" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
            
            {/* Map pin animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-12 h-12 bg-millo-red rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                {/* Pulse effect */}
                <motion.div
                  className="absolute inset-0 bg-millo-red rounded-full"
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.7, 0, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
            
            {/* Location text overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <p className="text-white font-medium">Tirana, Albania</p>
                <p className="text-white/70 text-sm">123 Paint Street</p>
              </div>
            </div>
          </div>
          
          {/* View Map Button */}
          <div className="p-6">
            <motion.button
              onClick={() => setShowEmbed(true)}
              className="w-full bg-millo-blue hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View Interactive Map
            </motion.button>
            
            <motion.a
              href={generateContactLinks.maps()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 border border-white/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in Google Maps
            </motion.a>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.123456789!2d19.8187!3d41.3275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE5JzM5LjAiTiAxOcKwNDknMDcuNCJF!5e0!3m2!1sen!2sal!4v1234567890123!5m2!1sen!2sal"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MilloColor Location"
            />
          </div>
          
          <div className="p-4 bg-black/50 backdrop-blur-sm border-t border-white/10">
            <motion.button
              onClick={() => setShowEmbed(false)}
              className="text-white/70 hover:text-white text-sm transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to preview
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}