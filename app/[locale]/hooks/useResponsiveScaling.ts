import { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';

/**
 * A custom hook to calculate a dynamic scale factor based on window width.
 * This allows for fluid, responsive scaling of 3D elements.
 * @returns {number} A scale factor that smoothly transitions between mobile and desktop sizes.
 */
export function useResponsiveScaling() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Debounced resize handler to prevent excessive updates
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 50); // Small delay to prevent excessive updates
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const scale = useMemo(() => {
    // Adjusted scaling system for all-caps text to prevent overflow
    // Desktop and large screens: Reduced scaling for all-caps text
    if (width >= 2560) {
      return THREE.MathUtils.mapLinear(width, 2560, 3840, 1.4, 1.8);
    } else if (width >= 1920) {
      return THREE.MathUtils.mapLinear(width, 1920, 2560, 1.2, 1.4);
    } else if (width >= 1440) {
      return THREE.MathUtils.mapLinear(width, 1440, 1920, 1.0, 1.2);
    } else if (width >= 1024) {
      return THREE.MathUtils.mapLinear(width, 1024, 1440, 0.8, 1.0);
    } else if (width >= 768) {
      // Tablets: reduced scaling for all-caps
      return THREE.MathUtils.mapLinear(width, 768, 1024, 0.5, 0.8);
    } else {
      // ALL mobile devices (<768px): Further reduced scaling for all-caps
      return THREE.MathUtils.mapLinear(width, 280, 768, 0.3, 0.5);
    }
  }, [width]);

  return scale;
}
