"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  
  // State for mobile menu and header transparency
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events to update header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-sm shadow-sm h-14' 
          : 'bg-white h-header'
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center"
        >
          {/* Replace with actual logo */}
          <div className="text-2xl font-bold text-millo-red">
            Millo<span className="text-millo-blue">Color</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`font-medium transition-colors hover:text-millo-red ${
              pathname === '/' ? 'text-millo-red' : ''
            }`}
          >
            {t('home')}
          </Link>
          <Link 
            href="/about" 
            className={`font-medium transition-colors hover:text-millo-red ${
              pathname === '/about' ? 'text-millo-red' : ''
            }`}
          >
            {t('about')}
          </Link>
          <Link 
            href="/products" 
            className={`font-medium transition-colors hover:text-millo-red ${
              pathname === '/products' ? 'text-millo-red' : ''
            }`}
          >
            {t('products')}
          </Link>
          <Link 
            href="/brands" 
            className={`font-medium transition-colors hover:text-millo-red ${
              pathname === '/brands' ? 'text-millo-red' : ''
            }`}
          >
            {t('brands')}
          </Link>
          <Link 
            href="/services" 
            className={`font-medium transition-colors hover:text-millo-red ${
              pathname === '/services' ? 'text-millo-red' : ''
            }`}
          >
            {t('services')}
          </Link>
          <Link 
            href="/contact" 
            className={`font-medium transition-colors hover:text-millo-red ${
              pathname === '/contact' ? 'text-millo-red' : ''
            }`}
          >
            {t('contact')}
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <LanguageSwitcher />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-2 text-gray-800 hover:text-millo-red focus:outline-none"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-16">
          <nav className="flex flex-col items-center justify-center h-full space-y-8 text-xl">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className={`font-medium transition-colors hover:text-millo-red ${
                pathname === '/' ? 'text-millo-red' : ''
              }`}
            >
              {t('home')}
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsMenuOpen(false)}
              className={`font-medium transition-colors hover:text-millo-red ${
                pathname === '/about' ? 'text-millo-red' : ''
              }`}
            >
              {t('about')}
            </Link>
            <Link 
              href="/products" 
              onClick={() => setIsMenuOpen(false)}
              className={`font-medium transition-colors hover:text-millo-red ${
                pathname === '/products' ? 'text-millo-red' : ''
              }`}
            >
              {t('products')}
            </Link>
            <Link 
              href="/brands" 
              onClick={() => setIsMenuOpen(false)}
              className={`font-medium transition-colors hover:text-millo-red ${
                pathname === '/brands' ? 'text-millo-red' : ''
              }`}
            >
              {t('brands')}
            </Link>
            <Link 
              href="/services" 
              onClick={() => setIsMenuOpen(false)}
              className={`font-medium transition-colors hover:text-millo-red ${
                pathname === '/services' ? 'text-millo-red' : ''
              }`}
            >
              {t('services')}
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setIsMenuOpen(false)}
              className={`font-medium transition-colors hover:text-millo-red ${
                pathname === '/contact' ? 'text-millo-red' : ''
              }`}
            >
              {t('contact')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
