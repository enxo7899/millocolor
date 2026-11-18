"use client";

import type { CSSProperties, ReactNode } from 'react';
import { displayFont } from '../home/font';
import { Rise } from '../home/Reveal';
import h from '../home/home.module.css';
import p from './pages.module.css';

export { h, p };

export const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

export const Marks = () => (
  <div className={h.marks} aria-hidden="true">
    <i /><i /><i /><i />
  </div>
);

/** Every inner page sits on the same signboard as the home page. */
export function PageShell({ children }: { children: ReactNode }) {
  return <div className={`${displayFont.variable} ${h.home}`}>{children}</div>;
}

type Field = 'dark' | 'bone' | 'blue' | 'red';

/**
 * Caps in the display face run up to ~0.9em per letter, so the title's longest word must fit
 * in 112/n % of its column (cqi). Short-worded titles keep the full size; a long word
 * such as Albanian PROFESIONISTËVE scales the whole title down instead of running under the photo.
 */
const fitTitle = (title: string) => {
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length));
  return { '--fit': `${Math.min(12.6, 112 / longest).toFixed(2)}cqi` } as CSSProperties;
};

/** The opening panel of an inner page: its own colour field, the title, and one supporting element. */
export function PageHero({
  field = 'dark',
  title,
  lead,
  aside,
  foot,
}: {
  field?: Field;
  title: string;
  lead?: ReactNode;
  aside?: ReactNode;
  foot?: ReactNode;
}) {
  return (
    <section className={`${p.hero} ${h[field]}`}>
      <Marks />
      <div className={h.wrap}>
        <div className={`${p.heroGrid} ${aside ? '' : p.heroSolo}`}>
          <div className={p.heroText}>
            <Rise><h1 className={p.h1} style={fitTitle(title)}>{title}</h1></Rise>
            {lead && <Rise delay={0.08}><p className={h.lead}>{lead}</p></Rise>}
            {foot && <Rise delay={0.14}>{foot}</Rise>}
          </div>
          {aside && <div className={p.heroAside}>{aside}</div>}
        </div>
      </div>
      {field === 'dark' && <span className={p.stripe} aria-hidden="true" />}
    </section>
  );
}

/** Hairline filter tabs (a toggle group: one pressed at a time). */
export function Tabs<K extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: K; label: string; count?: number }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <div role="group" aria-label={label} className={p.tabs}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          className={p.tab}
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
        >
          {o.label}
          {typeof o.count === 'number' && <sup>{o.count}</sup>}
        </button>
      ))}
    </div>
  );
}

/** Native disclosure list: keyboard and screen-reader behaviour come from the browser. */
export function Faq({ items, onBone = false }: { items: { question: string; answer: string }[]; onBone?: boolean }) {
  return (
    <ul className={`${p.faq} ${onBone ? p.onBone : ''}`}>
      {items.map((it) => (
        <li key={it.question}>
          <details className={p.faqItem}>
            <summary>
              <span>{it.question}</span>
              <span className={p.plus} aria-hidden="true" />
            </summary>
            <p>{it.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}
