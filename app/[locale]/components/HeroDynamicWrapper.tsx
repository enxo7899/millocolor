"use client";
import dynamic from 'next/dynamic';
import { preload } from 'react-dom';
import ErrorBoundary from './ErrorBoundary';
import HeroLoader, { HERO_SECTION_CLASS } from './HeroLoader';

// The loader renders with the page; the 3D scene streams in behind it.
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <section className={HERO_SECTION_CLASS}>
      <HeroLoader />
    </section>
  ),
});

export default function HeroDynamicWrapper() {
  // Start downloading the scene's assets in parallel with its code, instead of after it.
  preload('/models/spray_gun.opt.glb', { as: 'fetch', crossOrigin: 'anonymous' });
  preload('/models/millocolor-wordmark.svg', { as: 'fetch', crossOrigin: 'anonymous' });

  return (
    <ErrorBoundary posterSrc="">
      <HeroScene />
    </ErrorBoundary>
  );
}
