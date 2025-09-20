"use client";
import dynamic from 'next/dynamic';
import ErrorBoundary from './ErrorBoundary';

const Hero3DNoSSR = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => null,
});

export default function HeroDynamicWrapper() {
  // Remove auto-reload logic as it's causing issues for new users
  // The improved Hero3D component now has better loading reliability

  return (
    <ErrorBoundary posterSrc="/hero-background.jpg">
      <div data-hero-section>
        <Hero3DNoSSR />
      </div>
    </ErrorBoundary>
  );
}