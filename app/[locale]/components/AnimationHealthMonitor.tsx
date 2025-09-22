"use client";
import { useEffect, useRef } from 'react';
// import * as Sentry from '@sentry/nextjs';

interface AnimationHealthMonitorProps {
  animationReady: boolean;
  isMobile: boolean;
  componentName: string;
}

export default function AnimationHealthMonitor({ 
  animationReady, 
  isMobile, 
  componentName 
}: AnimationHealthMonitorProps) {
  const startTime = useRef<number>(Date.now());
  const checkInterval = useRef<NodeJS.Timeout | null>(null);
  const hasReportedIssue = useRef<boolean>(false);

  useEffect(() => {
    // Start monitoring after 2 seconds
    const monitorStartTimeout = setTimeout(() => {
      checkInterval.current = setInterval(() => {
        const elapsed = Date.now() - startTime.current;
        
        // If animation hasn't started after 5 seconds, report it
        if (!animationReady && elapsed > 5000 && !hasReportedIssue.current) {
          hasReportedIssue.current = true;
          
          console.warn(`🚨 Animation health check failed for ${componentName}`);
          
          // Sentry.captureMessage(`Animation failed to start: ${componentName}`, {
          //   level: 'warning',
          //   tags: {
          //     component: componentName,
          //     issue: 'animation-timeout',
          //     isMobile: isMobile.toString()
          //   },
          //   extra: {
          //     elapsedTime: elapsed,
          //     userAgent: navigator.userAgent,
          //     viewport: {
          //       width: window.innerWidth,
          //       height: window.innerHeight
          //     },
          //     timestamp: new Date().toISOString()
          //   }
          // });
        }
      }, 1000);
    }, 2000);

    return () => {
      clearTimeout(monitorStartTimeout);
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [animationReady, isMobile, componentName]);

  // Report successful animation start
  useEffect(() => {
    if (animationReady && !hasReportedIssue.current) {
      const elapsed = Date.now() - startTime.current;
      console.log(`✅ Animation health check passed for ${componentName} in ${elapsed}ms`);
      
      // Report performance metrics
      // Sentry.addBreadcrumb({
      //   message: `Animation started successfully: ${componentName}`,
      //   level: 'info',
      //   data: {
      //     elapsedTime: elapsed,
      //     isMobile,
      //     component: componentName
      //   }
      // });
    }
  }, [animationReady, isMobile, componentName]);

  return null; // This is a monitoring component, no UI
}