"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { contactInfo, generateContactLinks } from '../../../../data/contact';
import { displayFont } from '../home/font';
import s from './site.module.css';

export default function SiteFooter() {
  const t = useTranslations('nav');
  const f = useTranslations('footer');
  const h = useTranslations('hero');
  const p = useTranslations('home.places');
  const locale = useLocale();
  const logo = locale === 'en' ? '/images/logo_en.png' : '/images/logo_sq.png';
  const places = p.raw('items') as { city: string; name: string }[];
  const phone = contactInfo.phone.replace(/^(\+355)(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3 $4');

  return (
    <footer className={`${s.site} ${s.footer} ${displayFont.variable}`}>
      <div className={s.fwrap}>
        <div className={s.fgrid}>
          <div className={s.fbrand}>
            <Image src={logo} alt="Millocolor" width={180} height={60} style={{ height: 'auto', width: 180 }} />
            <p>{h('headline')}</p>
          </div>
          <nav className={s.fcol} aria-label="Footer">
            <h2 className={s.fhead}>{f('quickLinks.title')}</h2>
            <Link href={`/${locale}/products`}>{t('products')}</Link>
            <Link href={`/${locale}/brands`}>{t('brands')}</Link>
            <Link href={`/${locale}/services`}>{t('services')}</Link>
            <Link href={`/${locale}/about`}>{t('about')}</Link>
            <Link href={`/${locale}/contact`}>{t('contact')}</Link>
          </nav>
          <div className={s.fcol}>
            <h2 className={s.fhead}>{f('contact.title')}</h2>
            <a href={generateContactLinks.phone()}>{phone}</a>
            <a href={generateContactLinks.whatsapp()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href={generateContactLinks.email()}>{contactInfo.email}</a>
            <span>{contactInfo.address.full}</span>
          </div>
          <div className={s.fcol}>
            <h2 className={s.fhead}>{p('label')}</h2>
            {places.map((x) => (<span key={x.name}>{x.name.toLowerCase().includes(x.city.toLowerCase()) ? x.name : `${x.city} ${x.name.toLowerCase()}`}</span>))}
            <a href={contactInfo.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={contactInfo.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
        <div className={s.fbottom}>
          <span>© {new Date().getFullYear()} Millocolor sh.p.k.</span>
          <span>{p('hours')}</span>
        </div>
      </div>
    </footer>
  );
}
