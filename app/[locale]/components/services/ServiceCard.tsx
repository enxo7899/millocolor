/**
 * ServiceCard Component
 * 
 * Displays individual service cards with icon, title, description,
 * bullet points, and related brands in a luxury design.
 */

'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Service } from '../../../../data/services';

// Icon mapping for services
const iconMap: Record<string, string> = {
  'palette': '🎨',
  'graduation-cap': '🎓',
  'wrench-screwdriver': '🔧',
  'cog': '⚙️',
  'chart-bar': '📊',
  'building-office': '🏢',
  'headset': '🎧',
  'spray-can': '🪣'
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const t = useTranslations('services');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8, 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-full flex flex-col hover:bg-white/10 transition-all duration-300 group cursor-pointer">
        {/* Icon Section */}
        <div className="h-16 mb-4 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
            <span className="text-2xl">
              {iconMap[service.icon || 'cog']}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-millo-blue transition-colors duration-300">
            {t(service.titleKey)}
          </h3>

          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed mb-4 flex-1">
            {t(service.descKey)}
          </p>

          {/* Bullet Points */}
          {service.bulletsKeys && service.bulletsKeys.length > 0 && (
            <ul className="space-y-2 mb-4">
              {service.bulletsKeys.map((bulletKey, bulletIndex) => (
                <li key={bulletIndex} className="flex items-start text-xs text-white/60">
                  <span className="w-1.5 h-1.5 bg-millo-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {t(bulletKey)}
                </li>
              ))}
            </ul>
          )}

          {/* Related Brands */}
          {service.brands && service.brands.length > 0 && (
            <div className="mt-auto">
              <p className="text-white/50 text-xs mb-2">Related Brands:</p>
              <div className="flex flex-wrap gap-1">
                {service.brands.slice(0, 3).map((brand, brandIndex) => (
                  <span
                    key={brandIndex}
                    className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70"
                  >
                    {brand}
                  </span>
                ))}
                {service.brands.length > 3 && (
                  <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70">
                    +{service.brands.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}