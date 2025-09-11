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

// Main flag component that chooses the best option
interface FlagProps extends FlagIconProps {
  country: 'uk' | 'albania';
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
    return country === 'uk' 
      ? <UKFlagSimple className={className} size={size} />
      : <AlbaniaFlagSimple className={className} size={size} />;
  }
  
  // Use actual flag images
  return country === 'uk' 
    ? <UKFlag className={className} size={size} />
    : <AlbaniaFlag className={className} size={size} />;
};