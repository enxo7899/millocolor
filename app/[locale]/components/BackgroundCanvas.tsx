"use client";

import React from 'react';

/**
 * Luxury animated background with CSS-based animations
 * Provides a dark gradient background with floating elements for luxury aesthetic
 */
const BackgroundCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      
      {/* Animated floating circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-millo-blue/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-millo-red/10 rounded-full blur-3xl animate-float animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-millo-gold/5 rounded-full blur-2xl animate-float animation-delay-4000" />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};

export default BackgroundCanvas;
