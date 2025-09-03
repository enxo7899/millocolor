/**
 * Brands data structure for the brands page
 * 
 * To add/edit a brand:
 * 1. Add the brand object to the brands array below
 * 2. Add translations to messages/en/brands.json and messages/sq/brands.json
 * 3. Ensure the logo exists in /public/images/partners/ (optional)
 * 4. Update categories if needed
 */

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: {
    en: string;
    sq: string;
  };
  categories: string[];
  country?: string;
  logoSrc?: string;
  website?: string;
}

export const brands: Brand[] = [
  {
    id: 'cromax',
    slug: 'cromax',
    name: 'Cromax',
    description: {
      en: 'A premium automotive refinishing brand known for color accuracy and fast workflow systems.',
      sq: 'Markë premium për rinovimin e automobilave, e njohur për përputhje të saktë të ngjyrave dhe procese të shpejta pune.'
    },
    categories: ['Automotive Paints & Coatings'],
    country: 'Global',
    logoSrc: '/images/partners/cromax.jpg',
    website: 'https://www.cromax.com'
  },
  {
    id: 'duxone',
    slug: 'duxone',
    name: 'Duxone',
    description: {
      en: 'Professional automotive coatings delivering exceptional durability and color matching precision.',
      sq: 'Veshje profesionale automobilistike që ofrojnë qëndrueshmëri të jashtëzakonshme dhe saktësi të përputhjes së ngjyrave.'
    },
    categories: ['Automotive Paints & Coatings'],
    country: 'Global',
    logoSrc: '/images/partners/duxone.jpg',
    website: 'https://www.axalta.com/duxone_corporate/en_GB.html'
  },
  {
    id: 'ep-vernici',
    slug: 'ep-vernici',
    name: 'EP Vernici',
    description: {
      en: 'Italian manufacturer specializing in high-performance automotive and industrial coatings.',
      sq: 'Prodhues italian i specializuar në veshje automobilistike dhe industriale me performancë të lartë.'
    },
    categories: ['Automotive Paints & Coatings', 'Industrial Coatings'],
    country: 'Italy',
    logoSrc: '/images/partners/epvernici.jpg',
    website: 'https://www.epvernici.it'
  },
  {
    id: 'fiac',
    slug: 'fiac',
    name: 'FIAC',
    description: {
      en: 'Leading manufacturer of air compressors and pneumatic tools for professional applications.',
      sq: 'Prodhues kryesor i kompresorëve të ajrit dhe veglave pneumatike për aplikime profesionale.'
    },
    categories: ['Equipment & Tools'],
    country: 'Italy',
    logoSrc: '/images/partners/fiac.jpg',
    website: 'https://web.fiac.it'
  },
  {
    id: 'hempel',
    slug: 'hempel',
    name: 'Hempel',
    description: {
      en: 'Global leader in protective coatings for marine, industrial, and decorative applications.',
      sq: 'Lider global në veshje mbrojtëse për aplikime detare, industriale dhe dekorative.'
    },
    categories: ['Industrial Coatings', 'Marine Coatings'],
    country: 'Denmark',
    logoSrc: '/images/partners/hempel.jpg',
    website: 'https://www.hempel.com'
  },
  {
    id: 'jbm',
    slug: 'jbm',
    name: 'JBM',
    description: {
      en: 'Professional automotive tools and equipment for body shops and refinishing centers.',
      sq: 'Vegla dhe pajisje profesionale automobilistike për punëtori dhe qendra rinovimi.'
    },
    categories: ['Equipment & Tools'],
    country: 'Global',
    logoSrc: '/images/partners/jbm.jpg',
    website: 'https://jbmcamp.com/'
  },
  {
    id: 'master-dichem',
    slug: 'master-dichem',
    name: 'Master DiChem',
    description: {
      en: 'Specialized automotive refinishing products with focus on quality and innovation.',
      sq: 'Produkte të specializuara për rinovimin automobilistik me fokus në cilësi dhe inovacion.'
    },
    categories: ['Automotive Paints & Coatings'],
    country: 'Italy',
    logoSrc: '/images/partners/masterdichem.jpg',
    website: 'https://www.dichemitaly.com'
  },
  {
    id: 'mirka',
    slug: 'mirka',
    name: 'Mirka',
    description: {
      en: 'Premium abrasives and sanding solutions for professional surface preparation.',
      sq: 'Zgjidhje premium abrazive dhe lëmimi për përgatitjen profesionale të sipërfaqeve.'
    },
    categories: ['Equipment & Tools', 'Consumables'],
    country: 'Finland',
    logoSrc: '/images/partners/mirka.jpg',
    website: 'https://www.mirka.com'
  },
  {
    id: 'roberlo',
    slug: 'roberlo',
    name: 'Roberlo',
    description: {
      en: 'Spanish manufacturer of automotive refinishing systems and specialized coatings.',
      sq: 'Prodhues spanjoll i sistemeve të rinovimit automobilistik dhe veshjeve të specializuara.'
    },
    categories: ['Automotive Paints & Coatings'],
    country: 'Spain',
    logoSrc: '/images/partners/roberlo.jpg',
    website: 'https://www.roberlo.com'
  },
  {
    id: 'rupes',
    slug: 'rupes',
    name: 'RUPES',
    description: {
      en: 'Italian precision tools and polishing systems for automotive and industrial applications.',
      sq: 'Vegla italiane precizie dhe sisteme polirimi për aplikime automobilistike dhe industriale.'
    },
    categories: ['Equipment & Tools'],
    country: 'Italy',
    logoSrc: '/images/partners/RUPES.jpg',
    website: 'https://www.rupes.com'
  },
  {
    id: 'sata',
    slug: 'sata',
    name: 'SATA',
    description: {
      en: 'German precision spray guns and application equipment for professional refinishing.',
      sq: 'Pistoleta gjermane precizie dhe pajisje aplikimi për rinovim profesional.'
    },
    categories: ['Equipment & Tools'],
    country: 'Germany',
    logoSrc: '/images/partners/sata.jpg',
    website: 'https://www.sata.com'
  },
  {
    id: 'sherwin-williams',
    slug: 'sherwin-williams',
    name: 'Sherwin-Williams',
    description: {
      en: 'Global leader in paint and coatings with comprehensive automotive refinishing solutions.',
      sq: 'Lider global në bojëra dhe veshje me zgjidhje gjithëpërfshirëse për rinovim automobilistik.'
    },
    categories: ['Automotive Paints & Coatings'],
    country: 'USA',
    logoSrc: '/images/partners/SHW.jpg',
    website: 'https://www.sherwin-williams.com/'
  },
  {
    id: 'standox',
    slug: 'standox',
    name: 'Standox',
    description: {
      en: 'Premium automotive refinishing brand offering superior color matching and durability.',
      sq: 'Markë premium për rinovim automobilistik që ofron përputhje superiore ngjyrash dhe qëndrueshmëri.'
    },
    categories: ['Automotive Paints & Coatings'],
    country: 'Germany',
    logoSrc: '/images/partners/standox.jpg',
    website: 'https://www.standox.com'
  },
  {
    id: 'telwin',
    slug: 'telwin',
    name: 'TELWIN',
    description: {
      en: 'Italian manufacturer of welding equipment and automotive diagnostic tools.',
      sq: 'Prodhues italian i pajisjeve të saldimit dhe veglave diagnostike automobilistike.'
    },
    categories: ['Equipment & Tools'],
    country: 'Italy',
    logoSrc: '/images/partners/Telwin.jpg',
    website: 'https://www.telwin.com'
  },
  {
    id: 'troton',
    slug: 'troton',
    name: 'Troton',
    description: {
      en: 'Polish manufacturer of automotive refinishing products and specialized coatings.',
      sq: 'Prodhues polak i produkteve të rinovimit automobilistik dhe veshjeve të specializuara.'
    },
    categories: ['Automotive Paints & Coatings'],
    country: 'Poland',
    logoSrc: '/images/partners/troton.jpg',
    website: 'https://www.troton.pl'
  },
  {
    id: '3m',
    slug: '3m',
    name: '3M',
    description: {
      en: 'Global innovation company providing automotive refinishing and surface preparation solutions.',
      sq: 'Kompani globale inovacioni që ofron zgjidhje për rinovim automobilistik dhe përgatitjen e sipërfaqeve.'
    },
    categories: ['Equipment & Tools', 'Consumables'],
    country: 'USA',
    logoSrc: '/images/partners/3m.jpg',
    website: 'https://www.3m.com'
  }
];

// Category mapping for filters
export const categories = [
  'Automotive Paints & Coatings',
  'Equipment & Tools',
  'Industrial Coatings',
  'Marine Coatings',
  'Consumables'
];

// Helper function to get brands by category
export const getBrandsByCategory = (category: string): Brand[] => {
  return brands.filter(brand => brand.categories.includes(category));
};

// Helper function to search brands
export const searchBrands = (query: string): Brand[] => {
  const lowercaseQuery = query.toLowerCase();
  return brands.filter(brand => 
    brand.name.toLowerCase().includes(lowercaseQuery) ||
    brand.description.en.toLowerCase().includes(lowercaseQuery) ||
    brand.description.sq.toLowerCase().includes(lowercaseQuery)
  );
};