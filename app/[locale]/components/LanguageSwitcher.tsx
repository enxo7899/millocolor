"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Flag } from './FlagIcons';

// Language configuration with flag components and display names
const languages = {
  en: {
    flagComponent: 'uk',
    name: 'English',
    shortName: 'EN'
  },
  sq: {
    flagComponent: 'albania',
    name: 'Shqip',
    shortName: 'SQ'
  }
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);
  
  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // Switch the language
  const switchLanguage = (newLocale: string) => {
    // Close the dropdown
    setIsOpen(false);
    
    // Calculate the new path by replacing the locale segment
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    const newPath = `/${newLocale}${currentPathWithoutLocale}`;
    
    // Navigate to the new path
    router.push(newPath);
  };
  
  const currentLanguage = languages[locale as keyof typeof languages];
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-white/90 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-millo-blue/50 transition-all duration-200 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Current language: ${currentLanguage.name}. Click to change language.`}
      >
        <Flag 
          country={currentLanguage.flagComponent as 'uk' | 'albania'} 
          size={18} 
          className="flex-shrink-0"
        />
        <span className="hidden sm:inline text-sm font-medium">
          {currentLanguage.shortName}
        </span>
        <svg
          className={`w-4 h-4 fill-current transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          } group-hover:text-millo-red`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-fade-in overflow-hidden">
          <div className="py-2">
            {Object.entries(languages).map(([langCode, lang]) => (
              <button
                key={langCode}
                onClick={() => switchLanguage(langCode)}
                className={`flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gradient-to-r hover:from-millo-blue/5 hover:to-millo-red/5 group ${
                  locale === langCode 
                    ? 'bg-gradient-to-r from-millo-blue/10 to-millo-red/10 text-millo-blue border-r-2 border-millo-blue' 
                    : 'text-gray-700 hover:text-gray-900'
                }`}
                aria-label={`Switch to ${lang.name}`}
              >
                <Flag 
                  country={lang.flagComponent as 'uk' | 'albania'} 
                  size={20} 
                  className="flex-shrink-0"
                />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{lang.name}</span>
                  <span className="text-xs text-gray-500 group-hover:text-gray-600">
                    {lang.shortName}
                  </span>
                </div>
                {locale === langCode && (
                  <div className="ml-auto">
                    <svg className="w-4 h-4 text-millo-blue" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
