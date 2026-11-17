"use client";
import { Component, ErrorInfo, ReactNode } from 'react';
import { HERO_SECTION_CLASS } from './HeroLoader';
// import * as Sentry from '@sentry/nextjs';

interface Props {
  children: ReactNode;
  posterSrc: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Hero ErrorBoundary caught an error', error, info);
    
    // Send detailed error to Sentry
    // Sentry.captureException(error, {
    //   tags: {
    //     component: 'Hero3D',
    //     section: 'hero-animation'
    //   },
    //   extra: {
    //     errorInfo: info,
    //     userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    //     timestamp: new Date().toISOString(),
    //     url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    //   }
    // });
  }
  render() {
    if (this.state.hasError) {
      // 3D unavailable: show the finished, painted sign (the real logo artwork) on the same dark stage.
      return (
        <section className={HERO_SECTION_CLASS}>
          <div className="absolute left-1/2 top-[41%] w-[94vw] -translate-x-1/2 -translate-y-1/2 sm:w-[90vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/models/millocolor-wordmark.svg" alt="Millocolor" className="block w-full h-auto" />
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;