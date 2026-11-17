'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ContactBand, Places } from '../components/home/HomeSections';
import { Rise, Wipe } from '../components/home/Reveal';
import { Arrow, Marks, PageHero, PageShell, h, p } from '../components/pages/PageParts';

const SUPPLY = [
  { key: 'premiumPaints', image: '/images/products/fit/cromax-vr-1120.webp' },
  { key: 'auxiliaryMaterials', image: '/images/products/fit/troton-bold-putty.webp' },
  { key: 'equipment', image: '/images/products/fit/mirka-deros-680.webp' },
] as const;

export default function AboutPage() {
  const t = useTranslations('pages.about');
  const a = useTranslations('about');
  const r = useTranslations('home.range');
  const locale = useLocale();
  const beyond = t.raw('beyond') as { name: string; text: string }[];
  const countries = t.raw('countries') as string[];

  return (
    <PageShell>
      <PageHero
        title={t('title')}
        lead={t('lead')}
        aside={
          <Wipe>
            <div className={p.heroPhoto}>
              <Image
                src="/images/buildings/tirana_hq.jpg"
                alt="Millocolor headquarters, Tiranë–Durrës km 8"
                fill
                priority
                sizes="(max-width: 899px) 92vw, 40vw"
              />
            </div>
          </Wipe>
        }
      />

      {/* story */}
      <section className={`${h.sect} ${h.bone}`}>
        <div className={h.wrap}>
          <div className={p.split}>
            <div className={p.sticky}>
              <Rise><h2 className={h.h2}>{t('storyTitle')}</h2></Rise>
            </div>
            <Rise delay={0.1} className={p.prose}>
              <p>{a('mission.description')}</p>
              <p>{a('commitment.description')}</p>
            </Rise>
          </div>
        </div>
      </section>

      {/* what we supply */}
      <section className={`${h.sect} ${h.dark}`}>
        <div className={h.wrap}>
          <div className={h.rangeHead}>
            <Rise><h2 className={h.h2}>{t('supplyTitle')}</h2></Rise>
            <Rise delay={0.1}>
              <Link href={`/${locale}/products`} className={h.arrowLink}>{r('viewAll')}<Arrow /></Link>
            </Rise>
          </div>
          <div className={h.rows}>
            {SUPPLY.map((it, i) => (
              <Rise key={it.key} delay={i * 0.06}>
                <Link href={`/${locale}/products`} className={h.row}>
                  <h3 className={h.rowName}>{a(`whatWeOffer.${it.key}.title`)}</h3>
                  <div className={h.rowText}>
                    <p>{a(`whatWeOffer.${it.key}.description`)}</p>
                  </div>
                  <div className={h.thumb}>
                    <Image src={it.image} alt="" fill sizes="132px" />
                  </div>
                </Link>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* beyond the product */}
      <section className={`${h.sect} ${h.blue}`}>
        <Marks />
        <div className={h.wrap}>
          <div className={h.svcHead}>
            <Rise><h2 className={h.h2}>{t('beyondTitle')}</h2></Rise>
          </div>
          <div className={p.quad}>
            {beyond.map((it, i) => (
              <Rise key={it.name} delay={i * 0.08} className={p.quadItem}>
                <h3 className={h.svcName}>{it.name}</h3>
                <p>{it.text}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* where it comes from */}
      <section className={`${h.sect} ${h.bone}`}>
        <div className={h.wrap}>
          <div className={p.split}>
            <div className={p.sticky} style={{ display: 'grid', gap: 28 }}>
              <Rise><h2 className={h.h2}>{t('reachTitle')}</h2></Rise>
              <Rise delay={0.1}><p className={h.lead}>{a('reach.description')}</p></Rise>
            </div>
            <ul className={p.countries}>
              {countries.map((c, i) => (
                <li key={c}>
                  <Rise delay={i * 0.08}>{c}</Rise>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Places />
      <ContactBand />
    </PageShell>
  );
}
