'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { brands } from '../../../data/brands';
import { ContactBand } from '../components/home/HomeSections';
import { Rise } from '../components/home/Reveal';
import { Arrow, PageHero, PageShell, Tabs, h, p } from '../components/pages/PageParts';

type Cat = 'automotive' | 'equipment' | 'industrial' | 'marine' | 'consumables';
type Filter = 'all' | Cat;

const CAT_KEY: Record<string, Cat> = {
  'Automotive Paints & Coatings': 'automotive',
  'Equipment & Tools': 'equipment',
  'Industrial Coatings': 'industrial',
  'Marine Coatings': 'marine',
  'Consumables': 'consumables',
};
const FILTERS: Filter[] = ['all', 'automotive', 'industrial', 'equipment', 'consumables'];

const logoFor = (src?: string) => {
  const base = (src ?? '').split('/').pop()?.replace(/\.[a-z]+$/i, '').toLowerCase();
  return base ? `/images/partners/fit/${base}.webp` : null;
};

export default function BrandsPage() {
  const t = useTranslations('pages.brands');
  const c = useTranslations('pages.common');
  const f = useTranslations('brands.filters');
  const locale = useLocale() as 'en' | 'sq';
  const [filter, setFilter] = useState<Filter>('all');

  const list = useMemo(() => [...brands].sort((a, b) => a.name.localeCompare(b.name)), []);
  const shown = useMemo(
    () => list.filter((b) => filter === 'all' || b.categories.some((x) => CAT_KEY[x] === filter)),
    [list, filter],
  );
  const count = (k: Filter) => (k === 'all' ? list.length : list.filter((b) => b.categories.some((x) => CAT_KEY[x] === k)).length);
  const country = (name?: string) => {
    if (!name) return '';
    const key = `countries.${name}`;
    return t.has(key) ? t(key) : name;
  };

  return (
    <PageShell>
      <PageHero title={t('title')} lead={t('lead')} />

      <section className={`${h.sect} ${h.bone}`} style={{ paddingTop: 'clamp(40px, 5vw, 72px)' }}>
        <div className={h.wrap}>
          <Tabs
            label={t('filterLabel')}
            value={filter}
            onChange={setFilter}
            options={FILTERS.map((k) => ({ key: k, label: f(k), count: count(k) }))}
          />
          <ul className={p.brands} aria-live="polite">
            {shown.map((b) => {
              const logo = logoFor(b.logoSrc);
              return (
                <li key={b.id} className={p.brand}>
                  {b.website ? (
                    // the text link below is the accessible one; the logo is a larger mouse/touch target for the same URL
                    <a className={p.brandLogo} href={b.website} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                      {logo && <Image src={logo} alt="" fill sizes="(max-width: 599px) 112px, 220px" />}
                    </a>
                  ) : (
                    <div className={p.brandLogo}>
                      {logo && <Image src={logo} alt={`${b.name} logo`} fill sizes="(max-width: 599px) 112px, 220px" />}
                    </div>
                  )}
                  <Rise>
                    <h2 className={p.brandName}>{b.name}</h2>
                    <p className={p.brandCountry}>{country(b.country)}</p>
                  </Rise>
                  <p className={p.brandText}>{b.description[locale] ?? b.description.en}</p>
                  <div className={p.brandMeta}>
                    <span className={p.brandCats}>
                      {b.categories.map((x) => (CAT_KEY[x] ? f(CAT_KEY[x]) : x)).join(' · ')}
                    </span>
                    {b.website && (
                      <a className={h.arrowLink} href={b.website} target="_blank" rel="noopener noreferrer">
                        {c('visitWebsite')}<Arrow />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ContactBand />
    </PageShell>
  );
}
