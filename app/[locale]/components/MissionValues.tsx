'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const MissionValues = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const values = [
    {
      id: 'excellence',
      title: 'Excellence',
      icon: '⭐',
      description: 'Delivering premium automotive solutions with uncompromising quality standards since 1993.',
      color: 'from-blue-600 to-blue-800',
      hoverColor: 'from-blue-500 to-blue-700'
    },
    {
      id: 'innovation',
      title: 'Innovation',
      icon: '🚀',
      description: 'Pioneering cutting-edge paint technologies and training methods to keep professionals ahead.',
      color: 'from-red-600 to-red-800',
      hoverColor: 'from-red-500 to-red-700'
    },
    {
      id: 'sustainability',
      title: 'Sustainability',
      icon: '🌱',
      description: 'Committed to eco-friendly practices and sustainable solutions for a better tomorrow.',
      color: 'from-green-600 to-green-800',
      hoverColor: 'from-green-500 to-green-700'
    }
  ];

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Foundation
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Built on three pillars that drive everything we do
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.id}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onHoverStart={() => setHoveredCard(value.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              {/* Card */}
              <div className="relative h-80 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden group cursor-pointer">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  hoveredCard === value.id ? value.hoverColor : value.color
                } opacity-10 transition-all duration-500`} />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-center">
                  {/* Icon */}
                  <motion.div
                    className="text-6xl mb-6"
                    animate={{
                      scale: hoveredCard === value.id ? 1.2 : 1,
                      rotateY: hoveredCard === value.id ? 360 : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {value.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <motion.p
                    className="text-white/70 leading-relaxed"
                    animate={{
                      opacity: hoveredCard === value.id ? 1 : 0.7
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {value.description}
                  </motion.p>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />

                {/* Border glow effect */}
                {hoveredCard === value.id && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)`,
                      backgroundSize: '400% 400%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionValues;