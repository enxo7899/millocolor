"use client";
import { Component, ErrorInfo, ReactNode } from 'react';
import Image from 'next/image';
import * as Sentry from '@sentry/nextjs';

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
    Sentry.captureException(error, {
      tags: {
        component: 'Hero3D',
        section: 'hero-animation'
      },
      extra: {
        errorInfo: info,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown'
      }
    });
  }
  render() {
    if (this.state.hasError) {
      return (
        <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden">
          <Image
            src={this.props.posterSrc}
            alt="Hero fallback poster"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
              <span className="text-[#314485]">Millo</span>
              <span className="text-[#C73834]">Color</span>
            </h1>
            <p className="mt-4 text-xl md:text-3xl text-white/80">Premium automotive paint solutions</p>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;