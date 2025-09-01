'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const ServicesTimeline = () => {
  const t = useTranslations('training');
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const timelineSteps = [
    {
      id: 1,
      title: t('theoretical.title'),
      description: t('theoretical.description'),
      icon: '📚',
      duration: t('theoretical.duration'),
      features: t.raw('theoretical.features') as string[]
    },
    {
      id: 2,
      title: t('handsOn.title'),
      description: t('handsOn.description'),
      icon: '🎯',
      duration: t('handsOn.duration'),
      features: t.raw('handsOn.features') as string[]
    },
    {
      id: 3,
      title: t('certification.title'),
      description: t('certification.description'),
      icon: '🏆',
      duration: t('certification.duration'),
      features: t.raw('certification.features') as string[]
    }
  ];

  const testimonials = [
    {
      name: t('testimonials.student1.name'),
      position: t('testimonials.student1.role'),
      content: t('testimonials.student1.text'),
      rating: 5
    },
    {
      name: t('testimonials.student2.name'),
      position: t('testimonials.student2.role'),
      content: t('testimonials.student2.text'),
      rating: 5
    },
    {
      name: t('testimonials.student3.name'),
      position: t('testimonials.student3.role'),
      content: t('testimonials.student3.text'),
      rating: 5
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
            {t('title')}
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Timeline Section */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-millo-blue via-millo-red to-millo-blue opacity-30" />

            {timelineSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative flex items-start mb-12 last:mb-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onHoverStart={() => setHoveredStep(step.id)}
                onHoverEnd={() => setHoveredStep(null)}
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mr-6 flex-shrink-0">
                  <motion.div
                    className="text-2xl"
                    animate={{
                      scale: hoveredStep === step.id ? 1.2 : 1,
                      rotate: hoveredStep === step.id ? 360 : 0
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {step.icon}
                  </motion.div>
                  
                  {/* Pulse effect */}
                  {hoveredStep === step.id && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/30"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <motion.div
                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                    animate={{
                      scale: hoveredStep === step.id ? 1.02 : 1,
                      backgroundColor: hoveredStep === step.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white">
                        {step.title}
                      </h3>
                      <span className="text-sm text-millo-blue bg-millo-blue/20 px-3 py-1 rounded-full">
                        {step.duration}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-2">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-millo-red rounded-full" />
                          <span className="text-white/60 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                {t('testimonials.title')}
              </h3>

              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-yellow-400 text-lg"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        ⭐
                      </motion.span>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-white/80 mb-4 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-white/60 text-sm">{testimonial.position}</p>
                  </div>
                </motion.div>
              ))}

              {/* CTA */}
              <motion.div
                className="text-center pt-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button className="px-8 py-4 bg-millo-dark-blue text-white font-semibold rounded-full hover:bg-blue-800 hover:shadow-lg transition-all duration-300">
                  {t('cta')}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesTimeline;