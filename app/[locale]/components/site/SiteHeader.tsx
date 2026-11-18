"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { generateContactLinks, contactInfo } from '../../../../data/contact';
import LanguageSwitcher from '../LanguageSwitcher';
import { displayFont } from '../home/font';
import s from './site.module.css';

const LINKS = [
  { href: '', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/products', key: 'products' },
  { href: '/brands', key: 'brands' },
  { href: '/services', key: 'services' },
  { href: '/contact', key: 'contact' },
] as const;

export default function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [top, setTop] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setTop(window.scrollY < 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc); };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  const logo = locale === 'en' ? '/images/logo_en.png' : '/images/logo_sq.png';
  const current = (href: string) => pathname === `/${locale}${href}` || (href === '' && pathname === `/${locale}`);

  return (
    <div className={`${s.site} ${displayFont.variable}`}>
      <header className={s.header} data-top={top && !open}>
        <div className={s.bar}>
          <Link href={`/${locale}`} className={s.logo} aria-label="Millocolor">
            <Image src={logo} alt="Millocolor" width={150} height={50} priority style={{ height: 'auto', width: 150 }} />
          </Link>
          <nav className={s.nav} aria-label="Main">
            {LINKS.map((l) => (
              <Link key={l.key} href={`/${locale}${l.href}`} className={s.link} aria-current={current(l.href) ? 'page' : undefined}>
                {t(l.key)}
              </Link>
            ))}
          </nav>
          <div className={s.right}>
            <LanguageSwitcher />
            <a className={s.cta} href={generateContactLinks.whatsapp()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <button type="button" className={s.burger} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
              <i /><i />
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div className={s.sheet}>
          <nav className={s.sheetNav} aria-label="Mobile">
            {LINKS.map((l) => (
              <Link key={l.key} href={`/${locale}${l.href}`} className={s.sheetLink} aria-current={current(l.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
                {t(l.key)}
              </Link>
            ))}
          </nav>
          <div className={s.sheetFoot}>
            <a href={generateContactLinks.phone()}>{contactInfo.phone.replace(/^(\+355)(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3 $4')}</a>
            <a href={generateContactLinks.whatsapp()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <span>{contactInfo.address.full}</span>
          </div>
        </div>
      )}
    </div>
  );
}
