'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface Partner {
  name: string;
  logo: string;
  url: string;
}

/**
 * Infinite partner logo carousel with smooth animations
 * Inspired by premium automotive and tech websites
 */
const PartnerCarousel: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Major automotive paint brand partners
  const partners: Partner[] = [
    {
      name: 'LESONAL',
      logo: '/images/partners/lesonal.png',
      url: 'https://www.lesonal.com'
    },
    {
      name: 'GLASURIT',
      logo: '/images/partners/glasurit.png',
      url: 'https://www.glasurit.com'
    },
    {
      name: 'R-M',
      logo: '/images/partners/rm.png',
      url: 'https://www.rm-paintandbody.com'
    },
    {
      name: 'CROMAX',
      logo: '/images/partners/cromax.png',
      url: 'https://www.cromax.com'
    },
    {
      name: 'SPIES HECKER',
      logo: '/images/partners/spies-hecker.png',
      url: 'https://www.spieshecker.com'
    },
    {
      name: 'STANDOX',
      logo: '/images/partners/standox.png',
      url: 'https://www.standox.com'
    },
    {
      name: 'DUPLI-COLOR',
      logo: '/images/partners/dupli-color.png',
      url: 'https://www.dupli-color.com'
    },
    {
      name: 'MOTIP DUPLI',
      logo: '/images/partners/motip-dupli.png',
      url: 'https://www.motip-dupli.com'
    }
  ];

  return (
    <div className="relative py-8 overflow-hidden">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/50 to-transparent z-10" />
      
      {/* Main carousel container */}
      <div 
        className="flex items-center space-x-16 min-w-max"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* First set of logos */}
        <motion.div 
          className="flex items-center space-x-16 shrink-0"
          animate={{ 
            x: isPaused ? 0 : '-100%'
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop'
          }}
        >
          {partners.map((partner, index) => (
            <PartnerLogo key={`first-${index}`} partner={partner} />
          ))}
        </motion.div>

        {/* Second set of logos (for seamless loop) */}
        <motion.div 
          className="flex items-center space-x-16 shrink-0"
          animate={{ 
            x: isPaused ? 0 : '-100%'
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop'
          }}
        >
          {partners.map((partner, index) => (
            <PartnerLogo key={`second-${index}`} partner={partner} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

interface PartnerLogoProps {
  partner: Partner;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ partner }) => {
  return (
    <motion.a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center p-4 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-32 h-16 grayscale group-hover:grayscale-0 transition-all duration-500">
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          className="object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          sizes="128px"
        />
        
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)'
          }}
        />
      </div>
    </motion.a>
  );
};

export default PartnerCarousel;
