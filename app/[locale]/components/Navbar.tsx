'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium glassmorphic navigation bar inspired by luxury tech brands
 * Features scroll-based opacity changes, flag-based language switcher, and mobile menu
 */
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langSwitcherOpen, setLangSwitcherOpen] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();

  // Handle scroll effect for glassmorphic transition
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Handle escape key and click outside for mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setLangSwitcherOpen(false);
      }
    };
    
    if (menuOpen || langSwitcherOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen, langSwitcherOpen]);

  const switchLocale = (newLocale: string) => {
    setLangSwitcherOpen(false);
    router.push(`/${newLocale}`);
  };

  const navLinks = [
    { href: '/products', label: t('products'), icon: '🎨' },
    { href: '/about', label: t('about'), icon: '🏢' },
    { href: '/services', label: t('services'), icon: '⚙️' },
    { href: '/contact', label: t('contact'), icon: '📞' }
  ];

  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'sq', flag: '🇦🇱', name: 'Shqip' }
  ];

  const currentLang = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <>
      <motion.header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-xl shadow-2xl border-b border-white/20' 
            : 'bg-black/60 backdrop-blur-lg'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl md:text-3xl font-bold font-montserrat tracking-tight"
            >
              <span className="text-millo-blue group-hover:text-opacity-80 transition-colors">Millo</span>
              <span className="text-millo-red group-hover:text-opacity-80 transition-colors">Color</span>
              <motion.span 
                className="inline-block w-2 h-2 bg-millo-gold rounded-full ml-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.li key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link 
                  href={link.href}
                  className="flex items-center space-x-2 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium text-sm"
                >
                  <span className="relative z-10">{link.label}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-millo-blue to-millo-red rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-millo-gold to-millo-red opacity-0 group-hover:opacity-100 transition-all duration-300"
                    whileHover={{ width: '100%' }}
                    initial={{ width: 0 }}
                  />
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Desktop Language Switcher & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangSwitcherOpen(!langSwitcherOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                aria-label="Switch language"
              >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="text-sm font-medium text-white">{currentLang.code.toUpperCase()}</span>
                <motion.svg
                  className="w-4 h-4 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: langSwitcherOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {langSwitcherOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 right-0 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 shadow-xl overflow-hidden min-w-[140px]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${
                          locale === lang.code
                            ? 'bg-millo-blue/30 text-white'
                            : 'hover:bg-white/10 text-white/90 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-gradient-to-r from-millo-red to-millo-blue text-white font-semibold rounded-full hover:shadow-lg hover:shadow-millo-gold/25 transition-all duration-300 text-sm"
              >
                {t('cta')}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={menuOpen ? 'open' : 'closed'}
              variants={{
                open: { rotate: 45 },
                closed: { rotate: 0 }
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  variants={{
                    open: { d: "M6 18L18 6" },
                    closed: { d: "M3 6h18" }
                  }}
                />
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  variants={{
                    open: { opacity: 0 },
                    closed: { opacity: 1 }
                  }}
                  d="M3 12h18"
                />
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  variants={{
                    open: { d: "M6 6l12 12" },
                    closed: { d: "M3 18h18" }
                  }}
                />
              </svg>
            </motion.div>
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-luxury-gradient border-l border-white/10 z-50 md:hidden"
            >
              <div className="p-6 pt-20">
                {/* Mobile Logo */}
                <div className="mb-8 text-center">
                  <div className="text-2xl font-bold font-montserrat">
                    <span className="text-millo-blue">Millo</span>
                    <span className="text-millo-red">Color</span>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <ul className="space-y-4">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center space-x-3 p-4 text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <span className="text-xl">{link.icon}</span>
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Mobile Language Switcher */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-white/70 mb-3">Language</h4>
                  <div className="flex space-x-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          locale === lang.code
                            ? 'bg-millo-blue/30 text-white'
                            : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="font-medium text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile CTA */}
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-millo-red to-millo-blue text-white font-semibold rounded-full"
                  >
                    {t('cta')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
