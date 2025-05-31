"use client";

import { useTheme } from './ThemeProvider';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Map theme names to display names
  const themeNames = {
    light: 'Light',
    dark: 'Dark',
    contemporary: 'Contemporary'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select theme"
      >
        <span className="sr-only">Current theme:</span>
        {theme === 'light' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
        {theme === 'dark' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
        {theme === 'contemporary' && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        )}
        <span className="hidden md:inline-block">{themeNames[theme]}</span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden"
        >
          <div className="py-1">
            <button
              onClick={() => {
                setTheme('light');
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Light
            </button>
            <button
              onClick={() => {
                setTheme('dark');
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Dark
            </button>
            <button
              onClick={() => {
                setTheme('contemporary');
                setIsOpen(false);
              }}
              className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                theme === 'contemporary' ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Contemporary
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
