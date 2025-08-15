"use client";

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Animations for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

type Location = {
  id: number;
  city: string;
  tag?: string;
  country: string;
  address: string;
  phones: string[];
  email: string;
  image: string;
  pos?: { left: number; top: number };
  description: string;
};

const locations: Location[] = [
  {
    id: 1,
    city: "Tirana",
    tag: "Headquarters",
    country: "Albania",
    address: "Headquarters: Autostrada Tirane - Durres km8",
    phones: ["+355682095588", "+355686017350"],
    email: "info@millocolor.com",
    image: "/images/buildings/tirana_hq.jpg",
    pos: { left: 38, top: 58 },
    description: "Corporate HQ, training center and central distribution"
  },
  {
    id: 2,
    city: "Tirana",
    tag: "Branch",
    country: "Albania",
    address: "Njesia Tirane: Rruga Teodor Keko, Unaza e Re",
    phones: ["+355684032585", "+355686010084"],
    email: "info@millocolor.com",
    image: "/images/buildings/tirana.jpg",
    pos: { left: 46, top: 60 },
    description: "Retail & pro support for the capital area"
  },
  {
    id: 3,
    city: "Pristina",
    tag: "Branch",
    country: "Kosovo",
    address: "Njesia Prishtine: Magjistrale Prishtine - Ferizaj km5",
    phones: ["+383 49506444", "+38349506222"],
    email: "info@millocolor.com",
    image: "/images/buildings/pristina.jpg",
    pos: { left: 80, top: 24 },
    description: "Regional support hub for Kosovo"
  },
  {
    id: 4,
    city: "Elbasan",
    tag: "Branch",
    country: "Albania",
    address: "Njesia Elbasan: Rr. Nacionale Elbasan - Korce, 800 metra nga kryqezimi I Cerrikut",
    phones: ["+355686071146", "+355686024223"],
    email: "info@millocolor.com",
    image: "/images/buildings/elbasan.jpg",
    pos: { left: 58, top: 70 },
    description: "Service & logistics for Elbasan district"
  }
];

// Simple Globe Placeholder Component
function GlobePlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-millo-blue/20 via-purple-500/20 to-millo-red/20 rounded-2xl animate-pulse"></div>

      {/* Globe representation */}
      <div className="relative z-10">
        <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-millo-blue/30 to-millo-red/30 border-4 border-white/20 flex items-center justify-center relative overflow-hidden">
          {/* Continents representation */}
          <div className="absolute inset-4 bg-gradient-to-br from-green-400/40 to-blue-400/40 rounded-full"></div>

          {/* Location markers */}
          {locations.map((location) => (
            <div
              key={location.id}
              className="absolute w-3 h-3 bg-millo-red rounded-full border-2 border-white animate-ping"
              style={{
                left: `${location.pos?.left ?? 25}%`,
                top: `${location.pos?.top ?? 35}%`,
              }}
            >
              <div className="absolute -top-6 -left-1 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                {location.city} {location.tag ? `• ${location.tag}` : ''}
              </div>
            </div>
          ))}

          {/* Center text */}
          <div className="text-center text-white/80">
            <div className="text-2xl font-bold mb-2">🌍</div>
            <div className="text-sm">Interactive Globe</div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-4 left-4 w-2 h-2 bg-millo-blue rounded-full animate-bounce"></div>
      <div className="absolute top-8 right-8 w-3 h-3 bg-millo-red rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-8 left-8 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}
 

export default function LocationsSection() {
  const t = useTranslations();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [mapAddress, setMapAddress] = useState<string | null>(null);

  const toggleCard = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const openMap = (address: string) => setMapAddress(address);
  const closeMap = () => setMapAddress(null);

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-6">
            <span className="text-[#314485]">OUR</span>
            <span className="text-[#C73834]"> LOCATIONS</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Headquarters in Tirana with branches in Tirana, Pristina and Elbasan
          </p>
        </motion.div>

        {/* 3D Globe */}
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="relative h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10">
            <GlobePlaceholder />
          </div>
        </motion.div>

        {/* Location Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          layout
        >
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-millo-blue/50 transition-all duration-300 overflow-hidden"
              variants={cardVariants}
              transition={{ delay: index * 0.1 }}
              layout
            >
              {/* Image header with dark overlay for text readability */}
              <button type="button" className="w-full text-left" onClick={() => toggleCard(location.id)}>
                <div className="relative h-40 md:h-44 lg:h-48 overflow-hidden">
                  <img
                    src={location.image}
                    alt={`${location.city} ${location.tag ?? ''}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="relative z-10 p-4 flex items-end h-full">
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-millo-blue to-millo-red rounded-full flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{location.city} <span className="text-millo-blue">{location.tag ? `• ${location.tag}` : ''}</span></h3>
                          <p className="text-white/80 text-sm">{location.country}</p>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm">{location.description}</p>
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {expandedId === location.id && (
                  <motion.div
                    key="details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-6 pt-4"
                    layout
                  >
                    <div className="space-y-2">
                      <div className="flex items-start text-white/80 text-sm">
                        <svg className="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location.address}
                      </div>

                      {location.phones.map((ph) => (
                        <div key={ph} className="flex items-center text-white/80 text-sm">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {ph}
                        </div>
                      ))}

                      <div className="flex items-center text-white/80 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {location.email}
                      </div>

                      <div className="flex items-center text-white/80 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 9h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Mon-Fri: 8:00-17:30, Sat: 9:00-13:00
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        className="px-4 py-2 bg-gradient-to-r from-millo-blue to-millo-red text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                        onClick={(e) => { e.stopPropagation(); openMap(`${location.address}`); }}
                      >
                        Get Directions
                      </button>
                      <a
                        className="px-4 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300 text-center"
                        href={`tel:${location.phones[0]}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Call
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Google Maps Modal */}
        <AnimatePresence>
          {mapAddress && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/60" onClick={closeMap} />
              <motion.div
                className="relative bg-neutral-900 border border-white/10 rounded-xl overflow-hidden w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-2xl"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
              >
                <div className="flex items-center justify-between p-3 border-b border-white/10">
                  <div className="text-white/90 text-sm">Directions • {mapAddress}</div>
                  <button onClick={closeMap} className="text-white/70 hover:text-white px-2 py-1">✕</button>
                </div>
                <div className="w-full h-[60vh]">
                  <iframe
                    title="Google Maps"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
