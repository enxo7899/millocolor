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

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scale = useMemo(() => {
    // Scale the title to fill the screen width, respecting padding.
    // This is less aggressive to prevent overlap and fix mobile animation.
    // On a small screen (375px), scale is ~0.6
    // On a large screen (1920px), scale is ~1.2
    return THREE.MathUtils.mapLinear(width, 375, 1920, 0.6, 1.2);
  }, [width]);

  return scale;
}
