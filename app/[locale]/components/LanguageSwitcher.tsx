"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // Switch the language
  const switchLanguage = (newLocale: string) => {
    // Close the dropdown
    setIsOpen(false);
    
    // Calculate the new path by replacing the locale segment
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    const newPath = newLocale === 'en' 
      ? currentPathWithoutLocale  // Default locale (English) might not need the prefix
      : `/${newLocale}${currentPathWithoutLocale}`;
    
    // Navigate to the new path
    router.push(newPath);
  };
  
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center font-medium text-gray-800 hover:text-millo-red focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-1">{locale === 'en' ? 'English' : 'Shqip'}</span>
        <svg
          className="w-4 h-4 fill-current"
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
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => switchLanguage('en')}
              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                locale === 'en' ? 'bg-gray-100' : ''
              }`}
            >
              English
            </button>
            <button
              onClick={() => switchLanguage('sq')}
              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                locale === 'sq' ? 'bg-gray-100' : ''
              }`}
            >
              Shqip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
