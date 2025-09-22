"use client";

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

// Animated Hamburger Menu Component
const AnimatedHamburger = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-8 h-8 flex flex-col justify-center items-center space-y-1 group focus:outline-none focus:ring-2 focus:ring-millo-blue focus:ring-opacity-20 rounded-lg p-1"
      aria-label={isOpen ? "Close Menu" : "Open Menu"}
    >
      <span
        className={`block h-0.5 w-6 bg-white group-hover:bg-millo-red transition-all duration-300 transform origin-center ${
          isOpen ? 'rotate-45 translate-y-1' : ''
        }`}
      />
      <span
        className={`block h-0.5 w-6 bg-white group-hover:bg-millo-red transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`block h-0.5 w-6 bg-white group-hover:bg-millo-red transition-all duration-300 transform origin-center ${
          isOpen ? '-rotate-45 -translate-y-1' : ''
        }`}
      />
    </button>
  );
};

// Premium Logo Component - Unified with image logos for both languages
const PremiumLogo = () => {
  const locale = useLocale();
  
  // Determine which logo to use based on locale
  const logoSrc = locale === 'en' ? '/images/logo_en.png' : '/images/logo_sq.png';
  const logoAlt = locale === 'en' ? 'MilloColor Logo' : 'MilloColor Logo';
  
  return (
    <Link 
      href="/" 
      className="flex items-center group h-full py-2"
    >
      <div className="relative">
        <Image
          src={logoSrc}
          alt={logoAlt}
          width={180}
          height={60}
          className="transition-all duration-300 group-hover:scale-105 object-contain"
          priority
          quality={90}
        />
      </div>
    </Link>
  );
};

// Navigation Link Component
const NavLink = ({ href, children, pathname, onClick }: {
  href: string;
  children: React.ReactNode;
  pathname: string;
  onClick?: () => void;
}) => {
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      onClick={onClick}
      className={`relative font-medium text-sm whitespace-nowrap transition-all duration-200 group tracking-wide ${
        isActive 
          ? 'text-millo-red font-semibold' 
          : 'text-white/90 hover:text-white'
      }`}
      style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif' }}
    >
      {children}
      {/* Active indicator dot */}
      {isActive && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-millo-red rounded-full animate-bounce-gentle" />
      )}
      {/* Hover underline */}
      <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-millo-blue to-millo-red transition-all duration-300 ${
        isActive ? 'w-full' : 'w-0 group-hover:w-full'
      }`} />
    </Link>
  );
};

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  
  // State for mobile menu and header transparency
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll events to update header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
          isScrolled 
            ? 'bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-white/10' 
            : 'bg-slate-900/70 backdrop-blur-md'
        } h-18`}
      >
        {/* Modern gradient accent line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="w-full h-full">
          {/* Desktop Layout - True Absolute Edge Positioning */}
          <div className="hidden lg:flex lg:items-center h-full w-full">
            {/* Left: Logo at absolute left edge with zero padding */}
            <div className="pl-1">
              <PremiumLogo />
            </div>

            {/* Right: All navigation content - tight grouping with auto margin */}
            <div className="ml-auto flex items-center pr-1">
              <div className="flex items-center gap-x-4 lg:gap-x-5 xl:gap-x-6 2xl:gap-x-8">
                {/* Navigation Links */}
                <NavLink href="/" pathname={pathname}>{t('home')}</NavLink>
                <NavLink href="/about" pathname={pathname}>{t('about')}</NavLink>
                <NavLink href="/products" pathname={pathname}>{t('products')}</NavLink>
                <NavLink href="/brands" pathname={pathname}>{t('brands')}</NavLink>
                <NavLink href="/services" pathname={pathname}>{t('services')}</NavLink>
                <NavLink href="/contact" pathname={pathname}>{t('contact')}</NavLink>
                
                {/* Language Switcher */}
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* Mobile Layout - Absolute Edge Positioning */}
          <div className="lg:hidden flex items-center justify-between h-full">
            {/* Logo */}
            <div className="flex-shrink-0 pl-2">
              <PremiumLogo />
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-3 pr-2">
              <LanguageSwitcher />
              <AnimatedHamburger isOpen={isMenuOpen} onClick={toggleMobileMenu} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-black/90 backdrop-blur-xl shadow-2xl animate-slide-in-right">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <PremiumLogo />
              <AnimatedHamburger isOpen={isMenuOpen} onClick={toggleMobileMenu} />
            </div>
            
            {/* Mobile Navigation */}
            <nav className="flex flex-col p-6 space-y-6">
              <NavLink href="/" pathname={pathname} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center space-x-3 text-lg">
                  <span>🏠</span>
                  <span>{t('home')}</span>
                </div>
              </NavLink>
              <NavLink href="/about" pathname={pathname} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center space-x-3 text-lg">
                  <span>ℹ️</span>
                  <span>{t('about')}</span>
                </div>
              </NavLink>
              <NavLink href="/products" pathname={pathname} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center space-x-3 text-lg">
                  <span>🎨</span>
                  <span>{t('products')}</span>
                </div>
              </NavLink>
              <NavLink href="/brands" pathname={pathname} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center space-x-3 text-lg">
                  <span>🏷️</span>
                  <span>{t('brands')}</span>
                </div>
              </NavLink>
              <NavLink href="/services" pathname={pathname} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center space-x-3 text-lg">
                  <span>🔧</span>
                  <span>{t('services')}</span>
                </div>
              </NavLink>
              <NavLink href="/contact" pathname={pathname} onClick={() => setIsMenuOpen(false)}>
                <div className="flex items-center space-x-3 text-lg">
                  <span>📞</span>
                  <span>{t('contact')}</span>
                </div>
              </NavLink>
            </nav>
            
            {/* Mobile Actions */}
            <div className="absolute bottom-6 left-6 right-6">
              {/* Social Links */}
              <div className="flex justify-center space-x-4">
                <a href="#" className="p-2 text-gray-600 hover:text-millo-blue transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 text-gray-600 hover:text-millo-blue transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="p-2 text-gray-600 hover:text-millo-blue transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
