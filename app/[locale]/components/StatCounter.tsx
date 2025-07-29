'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
  icon?: React.ReactNode;
}

/**
 * Animated counter component for impressive statistics
 * Features eased counting animation and luxury styling
 */
const StatCounter: React.FC<StatCounterProps> = ({ 
  value, 
  label, 
  suffix = '+', 
  prefix = '',
  duration = 2500,
  delay = 0,
  icon
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const frame = useRef<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for triggering animation when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          // Start counting animation with delay
          setTimeout(() => {
            let start: number | null = null;
            const step = (timestamp: number) => {
              if (!start) start = timestamp;
              const progress = timestamp - start;
              
              // Cubic ease-out easing function for smooth animation
              const percent = Math.min(progress / duration, 1);
              const easedPercent = 1 - Math.pow(1 - percent, 3);
              
              setCount(Math.floor(easedPercent * value));
              
              if (percent < 1) {
                frame.current = requestAnimationFrame(step);
              } else {
                setCount(value); // Ensure it ends exactly on target value
              }
            };
            
            frame.current = requestAnimationFrame(step);
          }, delay);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
      observer.disconnect();
    };
  }, [value, duration, delay, hasAnimated]);

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: delay / 1000,
        ease: [0.215, 0.61, 0.355, 1]
      }
    }
  };

  return (
    <motion.div
      ref={elementRef}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-500 group"
    >
      {/* Icon */}
      {icon && (
        <motion.div 
          className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-millo-red to-millo-blue rounded-full text-white text-2xl shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
      )}

      {/* Counter Value */}
      <div className="mb-3">
        <motion.span 
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-millo-blue via-millo-red to-millo-gold bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {prefix}{count.toLocaleString()}{suffix}
        </motion.span>
      </div>

      {/* Label */}
      <motion.div 
        className="text-lg md:text-xl font-semibold text-white/90 group-hover:text-white transition-colors duration-300"
        whileHover={{ y: -2 }}
      >
        {label}
      </motion.div>

      {/* Subtle glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-millo-gold/10 via-transparent to-millo-blue/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        whileHover={{
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
        }}
      />
    </motion.div>
  );
};

export default StatCounter;
