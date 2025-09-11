"use client";
import dynamic from 'next/dynamic';
import ErrorBoundary from './ErrorBoundary';
import { useEffect, useRef } from 'react';

const Hero3DNoSSR = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => null,
});

export default function HeroDynamicWrapper() {
  const autoReloadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set a timeout to check if hero animation starts properly
    autoReloadTimeoutRef.current = setTimeout(() => {
      // Check for the specific hero elements that should be present
      const heroSection = document.querySelector('[data-hero-section]');
      const milloColorText = document.querySelector('h1')?.textContent?.includes('MILLOCOLOR');
      const sprayGunModel = document.querySelector('canvas'); // Three.js canvas
      const fallbackContent = document.querySelector('img[src*="aston-martin"]'); // Fallback car image
      
      // If we see fallback content instead of the 3D animation, trigger reload
      if (heroSection && (fallbackContent || (!milloColorText && !sprayGunModel))) {
        console.log('Hero animation not loaded properly, auto-reloading...');
        window.location.reload();
      }
    }, 6000); // Check after 6 seconds (reduced from 8)

    return () => {
      if (autoReloadTimeoutRef.current) {
        clearTimeout(autoReloadTimeoutRef.current);
      }
    };
  }, []);

  return (
    <ErrorBoundary posterSrc="/hero-background.jpg">
      <div data-hero-section>
        <Hero3DNoSSR />
      </div>
    </ErrorBoundary>
  );
}