'use client';

import { motion } from 'framer-motion';
import { generateContactLinks } from '../../../../data/contact';

export default function MapPreview() {
  // Google Maps embed URL with dark theme for MilloColor location - Tiranë - Durrës km8
  // Using coordinates and place ID from your Google Maps link with dark theme
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.123456789!2d19.6879331!3d41.3701147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13502fe0f91a2731%3A0x316865c77b4b7231!2sMillocolor%20Shpk%20-%20Tiran%C3%AB!5e0!3m2!1sen!2sal!4v1758456000000!5m2!1sen!2sal&t=m&z=15&style=feature:all|element:labels.text.fill|color:0xffffff&style=feature:all|element:labels.text.stroke|color:0x000000&style=feature:all|element:geometry.fill|color:0x2b2b2b&style=feature:all|element:geometry.stroke|color:0x404040";

  return (
    <div className="relative">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
        Our Location
      </h2>
      
      <motion.div
        className="relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Interactive Google Maps */}
        <div className="aspect-video">
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MilloColor Location - Tiranë - Durrës km8"
          />
        </div>
        
        {/* Location info and action buttons */}
        <div className="p-6 bg-black/50 backdrop-blur-sm border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-1">MilloColor Shpk - Tiranë</h3>
              <p className="text-white/70 text-sm mb-2">Tiranë - Durrës km8, Tirana, Albania</p>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>41.3701147°N, 19.6879331°E</span>
              </div>
            </div>
            
            <motion.a
              href={generateContactLinks.maps()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-millo-blue hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-millo-blue/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Get Directions
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}