/**
 * Services Data Structure
 * 
 * Defines the core services offered by MilloColor with proper typing
 * and internationalization keys for English and Albanian translations.
 */

export type Service = {
  id: string;
  slug: string;
  icon?: string; // path to svg or icon name
  titleKey: string; // e.g., "services.items.colorMatching.title"
  descKey: string; // e.g., "services.items.colorMatching.desc"
  bulletsKeys?: string[]; // optional highlights
  brands?: string[]; // optional related brands
  category: 'automotive' | 'industrial' | 'training' | 'equipment' | 'support';
};

export const services: Service[] = [
  {
    id: 'color-matching',
    slug: 'color-matching',
    icon: 'palette',
    titleKey: 'items.colorMatching.title',
    descKey: 'items.colorMatching.desc',
    bulletsKeys: [
      'items.colorMatching.bullet1',
      'items.colorMatching.bullet2',
      'items.colorMatching.bullet3'
    ],
    brands: ['Cromax', 'Standox', 'Sherwin-Williams'],
    category: 'automotive'
  },
  {
    id: 'technical-training',
    slug: 'technical-training',
    icon: 'graduation-cap',
    titleKey: 'items.technicalTraining.title',
    descKey: 'items.technicalTraining.desc',
    bulletsKeys: [
      'items.technicalTraining.bullet1',
      'items.technicalTraining.bullet2',
      'items.technicalTraining.bullet3'
    ],
    brands: ['Cromax', 'Standox', 'RUPES', 'Mirka'],
    category: 'training'
  },
  {
    id: 'bodyshop-consulting',
    slug: 'bodyshop-consulting',
    icon: 'wrench-screwdriver',
    titleKey: 'items.bodyshopConsulting.title',
    descKey: 'items.bodyshopConsulting.desc',
    bulletsKeys: [
      'items.bodyshopConsulting.bullet1',
      'items.bodyshopConsulting.bullet2',
      'items.bodyshopConsulting.bullet3'
    ],
    brands: ['Cromax', 'Standox', 'Roberlo'],
    category: 'automotive'
  },
  {
    id: 'equipment-supply',
    slug: 'equipment-supply',
    icon: 'cog',
    titleKey: 'items.equipmentSupply.title',
    descKey: 'items.equipmentSupply.desc',
    bulletsKeys: [
      'items.equipmentSupply.bullet1',
      'items.equipmentSupply.bullet2',
      'items.equipmentSupply.bullet3'
    ],
    brands: ['RUPES', 'Mirka', 'SATA', 'TELWIN', '3M'],
    category: 'equipment'
  },
  {
    id: 'process-audits',
    slug: 'process-audits',
    icon: 'chart-bar',
    titleKey: 'items.processAudits.title',
    descKey: 'items.processAudits.desc',
    bulletsKeys: [
      'items.processAudits.bullet1',
      'items.processAudits.bullet2',
      'items.processAudits.bullet3'
    ],
    brands: ['Cromax', 'Standox', 'RUPES'],
    category: 'support'
  },
  {
    id: 'industrial-coatings',
    slug: 'industrial-coatings',
    icon: 'building-office',
    titleKey: 'items.industrialCoatings.title',
    descKey: 'items.industrialCoatings.desc',
    bulletsKeys: [
      'items.industrialCoatings.bullet1',
      'items.industrialCoatings.bullet2',
      'items.industrialCoatings.bullet3'
    ],
    brands: ['Hempel', 'Sherwin-Williams', 'Troton'],
    category: 'industrial'
  },
  {
    id: 'after-sales-support',
    slug: 'after-sales-support',
    icon: 'headset',
    titleKey: 'items.afterSalesSupport.title',
    descKey: 'items.afterSalesSupport.desc',
    bulletsKeys: [
      'items.afterSalesSupport.bullet1',
      'items.afterSalesSupport.bullet2',
      'items.afterSalesSupport.bullet3'
    ],
    brands: ['Cromax', 'Standox', 'RUPES', 'Mirka'],
    category: 'support'
  },
  {
    id: 'spray-booth-setup',
    slug: 'spray-booth-setup',
    icon: 'spray-can',
    titleKey: 'items.sprayBoothSetup.title',
    descKey: 'items.sprayBoothSetup.desc',
    bulletsKeys: [
      'items.sprayBoothSetup.bullet1',
      'items.sprayBoothSetup.bullet2',
      'items.sprayBoothSetup.bullet3'
    ],
    brands: ['SATA', 'RUPES', '3M', 'Mirka'],
    category: 'equipment'
  }
];

// Service categories for filtering
export const serviceCategories = [
  { key: 'all', labelKey: 'categories.all' },
  { key: 'automotive', labelKey: 'categories.automotive' },
  { key: 'industrial', labelKey: 'categories.industrial' },
  { key: 'training', labelKey: 'categories.training' },
  { key: 'equipment', labelKey: 'categories.equipment' },
  { key: 'support', labelKey: 'categories.support' }
];

// Helper functions
export const getServicesByCategory = (category: string): Service[] => {
  if (category === 'all') return services;
  return services.filter(service => service.category === category);
};

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(service => service.slug === slug);
};