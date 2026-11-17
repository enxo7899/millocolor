"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { contactInfo, generateContactLinks } from '../../../../data/contact';
import { Rise, Wipe } from './Reveal';
import s from './home.module.css';

const LOGOS = [
  'standox', 'cromax', 'duxone', 'roberlo', 'sata',
  'mirka', 'RUPES', 'fiac', 'Telwin', 'hempel',
  'epvernici', 'masterdichem', 'SHW', 'troton', 'jbm',
];
const LOGO_NAMES: Record<string, string> = {
  standox: 'Standox', cromax: 'Cromax', duxone: 'Duxone', roberlo: 'Roberlo', sata: 'SATA',
  mirka: 'Mirka', RUPES: 'Rupes', fiac: 'FIAC', Telwin: 'Telwin', hempel: 'Hempel',
  epvernici: 'EP Vernici', masterdichem: 'Master DiChem', SHW: 'Sherwin-Williams', troton: 'Troton', jbm: 'JBM',
};

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

/** Products are shown from the re-framed copies (consistent fill, see scripts/assets/fit_assets.py). */
const fit = (src: string) => src.replace('/images/products/', '/images/products/fit/').replace(/\.jpg$/, '.webp');

const Marks = () => (
  <div className={s.marks} aria-hidden="true">
    <i /><i /><i /><i />
  </div>
);

interface RangeItem { name: string; text: string; brands: string; image: string }
interface ShelfItem { brand: string; name: string; tag: string; image: string }
interface ServiceItem { name: string; text: string }
interface PlaceItem { city: string; name: string; address: string; image: string }

export function BrandWall() {
  const t = useTranslations('home.brands');
  const locale = useLocale();
  return (
    <section className={`${s.sect} ${s.bone}`}>
      <div className={s.wrap}>
        <div className={s.brandGrid}>
          <div className={s.brandIntro}>
            <Rise><h2 className={s.h2}>{t('title')}</h2></Rise>
            <Rise delay={0.1}><p className={s.lead}>{t('text')}</p></Rise>
            <Rise delay={0.15}>
              <Link href={`/${locale}/brands`} className={s.arrowLink}>{t('all')}<Arrow /></Link>
            </Rise>
          </div>
          <Wipe>
            <ul className={s.logos} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {LOGOS.map((id) => (
                <li key={id} className={s.logo}>
                  <Image src={`/images/partners/fit/${id.toLowerCase()}.webp`} alt={LOGO_NAMES[id]} width={720} height={320} sizes="(max-width: 900px) 30vw, 14vw" />
                </li>
              ))}
            </ul>
          </Wipe>
        </div>
      </div>
    </section>
  );
}

export function Range() {
  const t = useTranslations('home.range');
  const locale = useLocale();
  const items = t.raw('items') as RangeItem[];
  return (
    <section className={`${s.sect} ${s.dark}`}>
      <div className={s.wrap}>
        <div className={s.rangeHead}>
          <Rise><h2 className={s.h2}>{t('title')}</h2></Rise>
          <Rise delay={0.1}>
            <Link href={`/${locale}/products`} className={s.arrowLink}>{t('viewAll')}<Arrow /></Link>
          </Rise>
        </div>
        <div className={s.rows}>
          {items.map((it, i) => (
            <Rise key={it.name} delay={i * 0.06}>
              <Link href={`/${locale}/products`} className={s.row}>
                <h3 className={s.rowName}>{it.name}</h3>
                <div className={s.rowText}>
                  <p>{it.text}</p>
                  <small>{it.brands}</small>
                </div>
                <div className={s.thumb}>
                  <Image src={fit(it.image)} alt="" fill sizes="132px" />
                </div>
              </Link>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Shelf() {
  const t = useTranslations('home.shelf');
  const r = useTranslations('home.range');
  const locale = useLocale();
  const items = t.raw('items') as ShelfItem[];
  return (
    <section className={`${s.sect} ${s.bone}`}>
      <div className={s.wrap}>
        <div className={s.shelfHead}>
          <Rise><h2 className={s.h2}>{t('title')}</h2></Rise>
          <Rise delay={0.1}><p className={s.lead}>{t('text')}</p></Rise>
        </div>
        <div className={s.tiles}>
          {items.map((it, i) => (
            <Wipe key={it.name} delay={(i % 3) * 0.1}>
              <Link href={`/${locale}/products`} className={s.tile}>
                <div className={s.tileImg}>
                  <Image src={fit(it.image)} alt={`${it.brand} ${it.name}`} fill sizes="(max-width: 900px) 46vw, 28vw" />
                </div>
                <div className={s.tileMeta}>
                  <span className={s.tileBrand}>{it.brand}</span>
                  <span className={s.tileName}>{it.name}</span>
                  <span className={s.tileTag}>{it.tag}</span>
                </div>
              </Link>
            </Wipe>
          ))}
        </div>
        <div className={s.shelfFoot}>
          <Link href={`/${locale}/products`} className={s.arrowLink}>{r('viewAll')}<Arrow /></Link>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const t = useTranslations('home.services');
  const locale = useLocale();
  const items = t.raw('items') as ServiceItem[];
  return (
    <section className={`${s.sect} ${s.blue}`}>
      <Marks />
      <div className={s.wrap}>
        <div className={s.svcHead}>
          <Rise><h2 className={s.h2}>{t('title')}</h2></Rise>
        </div>
        <div className={s.svcGrid}>
          {items.map((it, i) => (
            <Rise key={it.name} delay={i * 0.1} className={s.svc}>
              <h3 className={s.svcName}>{it.name}</h3>
              <p>{it.text}</p>
            </Rise>
          ))}
        </div>
        <div className={s.svcFoot}>
          <Link href={`/${locale}/services`} className={s.arrowLink}>{t('cta')}<Arrow /></Link>
        </div>
      </div>
    </section>
  );
}

export function Places() {
  const t = useTranslations('home.places');
  const items = t.raw('items') as PlaceItem[];
  return (
    <section className={`${s.sect} ${s.dark}`}>
      <div className={s.wrap}>
        <div className={s.placesHead}>
          <Rise><h2 className={s.h2}>{t('title')}</h2></Rise>
          <Rise delay={0.1}><p className={s.hours}>{t('hours')}</p></Rise>
        </div>
        <div className={s.places}>
          {items.map((it, i) => (
            <div key={it.name} className={s.place}>
              <Wipe delay={i * 0.12}>
                <div className={s.placeImg}>
                  <Image src={it.image} alt={`${it.name}, ${it.city}`} fill sizes="(max-width: 1100px) 46vw, 22vw" />
                </div>
              </Wipe>
              <Rise delay={0.1 + i * 0.12}>
                <h3 className={s.placeCity}>{it.city}</h3>
                <p className={s.placeName}>{it.name}</p>
              </Rise>
              <p className={s.placeAddr}>{it.address}</p>
              <a
                className={s.arrowLink}
                style={{ justifySelf: 'start' }}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Millocolor ${it.address}, ${it.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('directions')}<Arrow />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const formatPhone = (p: string) => p.replace(/^(\+355)(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3 $4');

export function ContactBand() {
  const t = useTranslations('home.contact');
  return (
    <section className={`${s.sect} ${s.red}`}>
      <Marks />
      <div className={s.wrap}>
        <div className={s.contactGrid}>
          <div style={{ display: 'grid', gap: 28 }}>
            <Rise><h2 className={`${s.h2} ${s.contactTitle}`}>{t('title')}</h2></Rise>
            <Rise delay={0.1}><p className={s.lead}>{t('text')}</p></Rise>
          </div>
          <Rise delay={0.15} className={s.contactSide}>
            <a className={s.phone} href={generateContactLinks.phone()}>{formatPhone(contactInfo.phone)}</a>
            <div className={s.btns}>
              <a className={`${s.btn} ${s.btnPrimary}`} href={generateContactLinks.whatsapp()} target="_blank" rel="noopener noreferrer">{t('whatsapp')}</a>
              <a className={s.btn} href={generateContactLinks.email()}>{t('email')}</a>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
