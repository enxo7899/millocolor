"use client";
import dynamic from 'next/dynamic';
import ErrorBoundary from './ErrorBoundary';

const Hero3DNoSSR = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => null,
});

export default function HeroDynamicWrapper() {
  return (
    <ErrorBoundary posterSrc="/hero-background.jpg">
      <Hero3DNoSSR />
    </ErrorBoundary>
  );
}