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
      // Check if the hero section is visible and has content
      const heroSection = document.querySelector('[data-hero-section]');
      const heroText = document.querySelector('h1');
      
      // If hero section exists but no text is visible, trigger reload
      if (heroSection && !heroText) {
        console.log('Hero animation not loaded properly, auto-reloading...');
        window.location.reload();
      }
    }, 8000); // Check after 8 seconds

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