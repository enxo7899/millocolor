'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { services } from '../../../data/services';
import { ContactBand } from '../components/home/HomeSections';
import { Rise, Wipe } from '../components/home/Reveal';
import { Faq, PageHero, PageShell, h, p } from '../components/pages/PageParts';

const STEPS = ['assess', 'recommend', 'implement', 'support'] as const;

export default function ServicesPage() {
  const t = useTranslations('pages.services');
  const s = useTranslations('services');
  const c = useTranslations('pages.common');
  const faq = s.raw('faq.items') as Record<string, { question: string; answer: string }>;

  return (
    <PageShell>
      <PageHero
        field="blue"
        title={t('title')}
        lead={s('hero.subtitle')}
        aside={
          <Wipe>
            <div className={p.heroPhoto}>
              <Image src="/images/process/mixing.webp" alt={t('photoAlt')} fill priority sizes="(max-width: 899px) 92vw, 40vw" style={{ objectPosition: '42% 50%' }} />
            </div>
          </Wipe>
        }
      />

      {/* the services */}
      <section className={`${h.sect} ${h.dark}`}>
        <div className={h.wrap}>
          <div className={h.svcHead}>
            <Rise><h2 className={h.h2}>{t('listTitle')}</h2></Rise>
          </div>
          <ul className={p.svcList}>
            {services.map((it, i) => (
              <li key={it.id} className={p.svcItem}>
                <Rise delay={(i % 2) * 0.08} className={p.svcBody}>
                  <h3 className={p.svcTitle}>{s(it.titleKey)}</h3>
                  <p>{s(it.descKey)}</p>
                  {it.bulletsKeys && (
                    <ul className={p.ticks}>
                      {it.bulletsKeys.map((k) => <li key={k}>{s(k)}</li>)}
                    </ul>
                  )}
                  {it.brands && it.brands.length > 0 && (
                    <span className={p.svcBrands}>{t('relatedBrands')}: {it.brands.join(', ')}</span>
                  )}
                </Rise>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* how we work: the order matters, so the steps are numbered */}
      <section className={`${h.sect} ${h.bone}`}>
        <div className={h.wrap}>
          <div className={h.shelfHead} style={{ marginBottom: 0 }}>
            <Rise><h2 className={h.h2}>{s('howWeWork.title')}</h2></Rise>
            <Rise delay={0.1}><p className={h.lead}>{s('howWeWork.subtitle')}</p></Rise>
          </div>
          <ol className={p.steps}>
            {STEPS.map((k, i) => (
              <li key={k} className={p.step}>
                <Rise delay={i * 0.08}>
                  <h3 className={p.stepName}>{s(`howWeWork.steps.${k}.title`)}</h3>
                </Rise>
                <p>{s(`howWeWork.steps.${k}.desc`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* questions */}
      <section className={`${h.sect} ${h.dark}`}>
        <div className={h.wrap}>
          <div className={p.faqGrid}>
            <Rise><h2 className={h.h2}>{c('faq')}</h2></Rise>
            <Faq items={Object.values(faq)} />
          </div>
        </div>
      </section>

      <ContactBand />
    </PageShell>
  );
}
