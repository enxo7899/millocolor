"use client";

import React from 'react';
import Image from 'next/image';

interface FlagIconProps {
  className?: string;
  size?: number;
}

// UK Flag using actual image
export const UKFlag: React.FC<FlagIconProps> = ({ className = "", size = 24 }) => (
  <Image
    src="/images/flags/englishflag.png"
    alt="United Kingdom flag"
    width={size}
    height={size * 0.6}
    className={`object-cover rounded-sm ${className}`}
    style={{ width: size, height: size * 0.6 }}
  />
);

// Albania Flag using actual image
export const AlbaniaFlag: React.FC<FlagIconProps> = ({ className = "", size = 24 }) => (
  <Image
    src="/images/flags/albanianflag.png"
    alt="Albania flag"
    width={size}
    height={size * 0.6}
    className={`object-cover rounded-sm ${className}`}
    style={{ width: size, height: size * 0.6 }}
  />
);

// Belgium Flag using actual image
export const BelgiumFlag: React.FC<FlagIconProps> = ({ className = "", size = 24 }) => (
  <Image
    src="/images/flags/belgium_flag.png"
    alt="Belgium flag"
    width={size}
    height={size * 0.6}
    className={`object-cover rounded-sm ${className}`}
    style={{ width: size, height: size * 0.6 }}
  />
);

// Germany Flag using actual image
export const GermanyFlag: React.FC<FlagIconProps> = ({ className = "", size = 24 }) => (
  <Image
    src="/images/flags/germany_flag.png"
    alt="Germany flag"
    width={size}
    height={size * 0.6}
    className={`object-cover rounded-sm ${className}`}
    style={{ width: size, height: size * 0.6 }}
  />
);

// Spain Flag using actual image
export const SpainFlag: React.FC<FlagIconProps> = ({ className = "", size = 24 }) => (
  <Image
    src="/images/flags/spain_flag.png"
    alt="Spain flag"
    width={size}
    height={size * 0.6}
    className={`object-cover rounded-sm ${className}`}
    style={{ width: size, height: size * 0.6 }}
  />
);

// Simple fallback flags (text-based)
export const UKFlagSimple: React.FC<FlagIconProps> = ({ className = "", size = 24 }) => (
  <div
    className={`rounded-sm bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center text-white font-bold text-xs ${className}`}
    style={{ width: size, height: size * 0.6 }}
    role="img"
    aria-label="United Kingdom flag"
  >
    UK
  </div>
);

export const AlbaniaFlagSimple: React.FC<FlagIconProps> = ({ className = "", size = 24 }) => (
  <div
    className={`rounded-sm bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-bold text-xs ${className}`}
    style={{ width: size, height: size * 0.6 }}
    role="img"
    aria-label="Albania flag"
  >
    AL
  </div>
);

export const BelgiumFlagSimple: React.FC<FlagIconProps> = ({ className = "", size = 24 }) => (
  <div
    className={`rounded-sm bg-gradient-to-r from-black via-yellow-500 to-red-600 flex items-center justify-center text-white font-bold text-xs ${className}`}
    style={{ width: size, height: size * 0.6 }}
    role="img"
    aria-label="Belgium flag"
  >
    BE
  </div>
);

export const GermanyFlagSimple: React.FC<FlagIconProps> = ({ className = "", size = 24 }) => (
  <div
    className={`rounded-sm bg-gradient-to-b from-black via-red-600 to-yellow-500 flex items-center justify-center text-white font-bold text-xs ${className}`}
    style={{ width: size, height: size * 0.6 }}
    role="img"
    aria-label="Germany flag"
  >
    DE
  </div>
);

export const SpainFlagSimple: React.FC<FlagIconProps> = ({ className = "", size = 24 }) => (
  <div
    className={`rounded-sm bg-gradient-to-b from-red-600 via-yellow-500 to-red-600 flex items-center justify-center text-white font-bold text-xs ${className}`}
    style={{ width: size, height: size * 0.6 }}
    role="img"
    aria-label="Spain flag"
  >
    ES
  </div>
);

// Main flag component that chooses the best option
interface FlagProps extends FlagIconProps {
  country: 'uk' | 'albania' | 'belgium' | 'germany' | 'spain';
  variant?: 'detailed' | 'simple' | 'auto';
}

export const Flag: React.FC<FlagProps> = ({ 
  country, 
  variant = 'detailed', 
  className = "", 
  size = 24 
}) => {
  // Use actual images by default, fallback to simple text flags if needed
  if (variant === 'simple') {
    switch (country) {
      case 'uk': return <UKFlagSimple className={className} size={size} />;
      case 'albania': return <AlbaniaFlagSimple className={className} size={size} />;
      case 'belgium': return <BelgiumFlagSimple className={className} size={size} />;
      case 'germany': return <GermanyFlagSimple className={className} size={size} />;
      case 'spain': return <SpainFlagSimple className={className} size={size} />;
      default: return <UKFlagSimple className={className} size={size} />;
    }
  }
  
  // Use actual flag images
  switch (country) {
    case 'uk': return <UKFlag className={className} size={size} />;
    case 'albania': return <AlbaniaFlag className={className} size={size} />;
    case 'belgium': return <BelgiumFlag className={className} size={size} />;
    case 'germany': return <GermanyFlag className={className} size={size} />;
    case 'spain': return <SpainFlag className={className} size={size} />;
    default: return <UKFlag className={className} size={size} />;
  }
};