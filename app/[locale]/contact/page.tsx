'use client';

import { useTranslations } from 'next-intl';
import { contactInfo, generateContactLinks } from '../../../data/contact';
import { Places } from '../components/home/HomeSections';
import { Rise } from '../components/home/Reveal';
import { Faq, PageHero, PageShell, h, p } from '../components/pages/PageParts';

const formatPhone = (n: string) => n.replace(/^(\+355)(\d{2})(\d{3})(\d{4})$/, '$1 $2 $3 $4');

export default function ContactPage() {
  const t = useTranslations('pages.contact');
  const c = useTranslations('pages.common');
  const faq = useTranslations('contact').raw('faq.items') as Record<string, { question: string; answer: string }>;
  const hours = t.raw('hours') as string[];

  return (
    <PageShell>
      <PageHero
        field="red"
        title={t('title')}
        lead={t('lead')}
        foot={
          <div className={h.btns}>
            <a className={`${h.btn} ${h.btnPrimary}`} href={generateContactLinks.whatsapp()} target="_blank" rel="noopener noreferrer">
              {c('whatsapp')}
            </a>
            <a className={h.btn} href={generateContactLinks.phone()}>{c('call')}</a>
          </div>
        }
        aside={
          <Rise delay={0.12} className={p.reach}>
            <div className={p.reachRow}>
              <span className={p.reachLabel}>{t('phoneLabel')}</span>
              <a className={p.reachValue} href={generateContactLinks.phone()}>{formatPhone(contactInfo.phone)}</a>
            </div>
            <div className={p.reachRow}>
              <span className={p.reachLabel}>{t('emailLabel')}</span>
              <a className={p.reachValue} href={generateContactLinks.email()}>{contactInfo.email}</a>
            </div>
            <div className={p.reachRow} style={{ borderBottom: 0, paddingBottom: 0 }}>
              <span className={p.reachLabel}>{t('hoursLabel')}</span>
              <ul className={p.hoursList}>
                {hours.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </div>
          </Rise>
        }
      />

      <Places />

      <section className={`${h.sect} ${h.bone}`}>
        <div className={h.wrap}>
          <div className={p.faqGrid}>
            <Rise><h2 className={h.h2}>{c('faq')}</h2></Rise>
            <Faq items={Object.values(faq)} onBone />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
