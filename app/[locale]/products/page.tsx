'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { generateContactLinks } from '../../../data/contact';
import { ContactBand } from '../components/home/HomeSections';
import { Rise, Wipe } from '../components/home/Reveal';
import { Arrow, PageHero, PageShell, Tabs, h, p } from '../components/pages/PageParts';

type Group = 'finish' | 'prep' | 'industrial' | 'sanding' | 'equipment';
type Filter = 'all' | Group;

const BRAND: Record<string, string> = {
  roberlo: 'Roberlo', cromax: 'Cromax', standox: 'Standox', duxone: 'Duxone', hempel: 'Hempel',
  fiac: 'FIAC', epvernici: 'EP Vernici', jbm: 'JBM', masterdichem: 'Master DiChem', mirka: 'Mirka',
  shw: 'Sherwin-Williams', telwin: 'Telwin', troton: 'Troton',
};

/** The catalogue in shelf order. Copy lives in productShowcase.productsData (both languages). */
const PRODUCTS: { id: string; group: Group }[] = [
  { id: 'roberlo-kronox-510', group: 'finish' },
  { id: 'cromax-vr-1120', group: 'finish' },
  { id: 'standox-k9600-xtreme', group: 'finish' },
  { id: 'standox-k9510-easy', group: 'finish' },
  { id: 'duxone-dx64', group: 'finish' },
  { id: 'epvernici-vprl', group: 'finish' },
  { id: 'roberlo-multyfiller-express', group: 'prep' },
  { id: 'cromax-710r', group: 'prep' },
  { id: 'duxone-dx48', group: 'prep' },
  { id: 'masterdichem-acrilprimer-gold', group: 'prep' },
  { id: 'epvernici-vrap', group: 'prep' },
  { id: 'troton-light-putty', group: 'prep' },
  { id: 'troton-bold-putty', group: 'prep' },
  { id: 'masterdichem-sigil-metal', group: 'prep' },
  { id: 'hempel-zinc-17360', group: 'industrial' },
  { id: 'hempel-underwater-primer', group: 'industrial' },
  { id: 'shw-wood-basecoat', group: 'industrial' },
  { id: 'shw-wood-topcoat', group: 'industrial' },
  { id: 'mirka-deros-680', group: 'sanding' },
  { id: 'mirka-abranet', group: 'sanding' },
  { id: 'fiac-500-industrial-black', group: 'equipment' },
  { id: 'fiac-500-silver', group: 'equipment' },
  { id: 'jbm-7-drawer-trolley', group: 'equipment' },
  { id: 'jbm-modular-storage', group: 'equipment' },
  { id: 'telwin-smart-inductor-5000', group: 'equipment' },
  { id: 'telwin-aqua-inductor-6000', group: 'equipment' },
];

const GROUPS: Filter[] = ['all', 'finish', 'prep', 'industrial', 'sanding', 'equipment'];

interface ProductCopy { name: string; description: string; features: string[] }

export default function ProductsPage() {
  const t = useTranslations('pages.products');
  const c = useTranslations('pages.common');
  const data = useTranslations('productShowcase').raw('productsData') as Record<string, ProductCopy>;
  const [filter, setFilter] = useState<Filter>('all');

  const shown = useMemo(() => PRODUCTS.filter((x) => filter === 'all' || x.group === filter), [filter]);
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: PRODUCTS.length };
    for (const x of PRODUCTS) m[x.group] = (m[x.group] ?? 0) + 1;
    return m;
  }, []);

  return (
    <PageShell>
      <PageHero
        title={t('title')}
        lead={t('lead')}
        foot={<span className={p.count}>{t('count', { count: PRODUCTS.length })}</span>}
        aside={
          <Wipe>
            <div className={p.heroPhoto}>
              <Image src="/images/process/warehouse.webp" alt={t('photoAlt')} fill priority sizes="(max-width: 899px) 92vw, 40vw" />
            </div>
          </Wipe>
        }
      />

      <section className={`${h.sect} ${h.bone}`} style={{ paddingTop: 'clamp(40px, 5vw, 72px)' }}>
        <div className={h.wrap}>
          <Tabs
            label={t('filterLabel')}
            value={filter}
            onChange={setFilter}
            options={GROUPS.map((g) => ({ key: g, label: t(`groups.${g}`), count: counts[g] }))}
          />
          <ul className={p.products} aria-live="polite">
            {shown.map((x, i) => {
              const copy = data[x.id];
              if (!copy) return null;
              const brand = BRAND[x.id.split('-')[0]] ?? '';
              return (
                <li key={x.id} className={p.product}>
                  <div className={p.productImg}>
                    <Image
                      src={`/images/products/fit/${x.id}.webp`}
                      alt={`${brand} ${copy.name}`}
                      fill
                      priority={i < 3}
                      sizes="(max-width: 599px) 92vw, (max-width: 1100px) 46vw, 30vw"
                    />
                  </div>
                  <Rise className={p.productBody}>
                    <span className={p.productBrand}>{brand}</span>
                    <h2 className={p.productName}>{copy.name}</h2>
                    <p className={p.productText}>{copy.description}</p>
                    {copy.features?.length > 0 && (
                      <ul className={p.feats}>
                        {copy.features.map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    )}
                    <a
                      className={`${h.arrowLink} ${p.productAsk}`}
                      href={generateContactLinks.whatsapp(c('askMessage', { name: `${brand} ${copy.name}` }))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c('ask')}<Arrow />
                    </a>
                  </Rise>
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
