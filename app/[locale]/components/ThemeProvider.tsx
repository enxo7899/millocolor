"use client";

import { createContext, useContext, useEffect, useState } from 'react';

// Define the available themes
type Theme = 'light' | 'dark' | 'contemporary';

// Interface for the theme context
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  prefersReducedMotion: boolean;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  prefersReducedMotion: false,
});

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Get theme from local storage or use default 'light'
  const [theme, setTheme] = useState<Theme>('light');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Try to get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    if (savedTheme && ['light', 'dark', 'contemporary'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // If no saved theme but system prefers dark, use dark
      setTheme('dark');
    }
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);
  
  // Update the class on the HTML element when theme changes
  useEffect(() => {
    // Make sure the DOM is available
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement;
      htmlElement.classList.remove('light', 'dark', 'contemporary');
      htmlElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, prefersReducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}
