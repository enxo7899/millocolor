"use client";

import React, { useState, useEffect, useRef } from 'react';

export interface TypewriterTextProps {
  /** Array of strings to cycle through */
  strings: string[];
  /** Speed of typing in milliseconds per character */
  typingSpeed?: number;
  /** Speed of deleting in milliseconds per character */
  deletingSpeed?: number;
  /** Pause duration between typing and deleting in milliseconds */
  pauseDuration?: number;
  /** Additional CSS classes for styling */
  className?: string;
  /** Color for each string - should match the length of strings array */
  colors?: string[];
}

export default function TypewriterText({
  strings,
  typingSpeed = 120,
  deletingSpeed = 60,
  pauseDuration = 2500,
  className = '',
  colors = []
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (strings.length === 0) return;

    const currentString = strings[currentIndex];
    const currentColor = colors[currentIndex] || 'inherit';

    const handleTyping = () => {
      if (isDeleting) {
        // Deleting characters
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
          timeoutRef.current = setTimeout(handleTyping, deletingSpeed);
        } else {
          // Done deleting, move to next string
          setIsDeleting(false);
          setIsDone(false);
          setCurrentIndex((prev) => (prev + 1) % strings.length);
          timeoutRef.current = setTimeout(handleTyping, 300);
        }
      } else {
        // Typing characters
        if (displayText.length < currentString.length) {
          setDisplayText(currentString.slice(0, displayText.length + 1));
          timeoutRef.current = setTimeout(handleTyping, typingSpeed);
        } else {
          // Done typing, pause then start deleting
          setIsDone(true);
          timeoutRef.current = setTimeout(() => {
            setIsDeleting(true);
            setIsDone(false);
            handleTyping();
          }, pauseDuration);
        }
      }
    };

    timeoutRef.current = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, currentIndex, isDeleting, isDone, strings, typingSpeed, deletingSpeed, pauseDuration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (strings.length === 0) {
    return null;
  }

  const currentColor = colors[currentIndex] || 'inherit';

  return (
    <span className={`inline-block ${className}`}>
      <span style={{ color: currentColor }}>
        {displayText}
      </span>
      <span className="ml-1 animate-pulse text-white">|</span>
    </span>
  );
}
