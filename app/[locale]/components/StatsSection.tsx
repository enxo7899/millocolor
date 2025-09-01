'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  suffix = '', 
  duration = 2 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const incrementTime = (duration * 1000) / end;
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) {
          clearInterval(timer);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const StatsSection = () => {
  const t = useTranslations('stats');
  
  const stats = [
    {
      value: 30,
      suffix: '+',
      label: t('years.title'),
      icon: '📅',
      description: t('years.description'),
      color: 'from-blue-600 to-blue-800'
    },
    {
      value: 10,
      suffix: '+',
      label: t('brands.title'),
      icon: '🌍',
      description: t('brands.description'),
      color: 'from-red-600 to-red-800'
    },
    {
      value: 5000,
      suffix: '+',
      label: t('clients.title'),
      icon: '😊',
      description: t('clients.description'),
      color: 'from-green-600 to-green-800'
    },
    {
      value: 100,
      suffix: '+',
      label: t('sessions.title'),
      icon: '🎓',
      description: t('sessions.description'),
      color: 'from-purple-600 to-purple-800'
    }
  ];

  return (
    <section className="py-20 relative z-10">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Card */}
              <div className="relative h-64 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-center items-center text-center">
                  {/* Icon */}
                  <motion.div
                    className="text-4xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {stat.icon}
                  </motion.div>

                  {/* Counter */}
                  <motion.div
                    className="text-4xl md:text-5xl font-bold text-white mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix}
                      duration={2 + index * 0.5} 
                    />
                  </motion.div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent"
                  whileHover={{
                    borderColor: 'rgba(255,255,255,0.3)',
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Pulse effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  initial={{ scale: 1, opacity: 0 }}
                  whileHover={{ scale: 1.05, opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: `linear-gradient(45deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})`,
                  }}
                />
              </div>

              {/* Floating particles effect */}
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              />
              <motion.div
                className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-white/20 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional info section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t('trusted.title')}
            </h3>
            <p className="text-white/70 leading-relaxed">
              {t('trusted.description')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;