"use client";

import HeroDynamicWrapper from './components/HeroDynamicWrapper';
import { BrandWall, Range, Shelf, Services, Places, ContactBand } from './components/home/HomeSections';
import { displayFont } from './components/home/font';
import s from './components/home/home.module.css';

export default function Home() {
  return (
    <div className={`${displayFont.variable} ${s.home}`}>
      <section style={{ background: '#121316', position: 'relative', zIndex: 10 }}>
        <HeroDynamicWrapper />
      </section>
      <BrandWall />
      <Range />
      <Shelf />
      <Services />
      <Places />
      <ContactBand />
    </div>
  );
}
