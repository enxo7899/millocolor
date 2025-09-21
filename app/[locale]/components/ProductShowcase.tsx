'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
// Arrow right icon component
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  features: string[];
}

interface ProductShowcaseProps {
  isHomepage?: boolean;
  maxProducts?: number;
}

export default function ProductShowcase({ isHomepage = false, maxProducts }: ProductShowcaseProps) {
  const t = useTranslations('productShowcase');

  // Lightweight config for images and categories (texts come from i18n)
  const productConfigs: Array<Pick<Product, 'id' | 'image' | 'category'>> = [
    // Roberlo
    { id: 'roberlo-kronox-510', image: '/images/products/roberlo-kronox-510.jpg', category: 'Professional' },
    { id: 'roberlo-multyfiller-express', image: '/images/products/roberlo-multyfiller-express.jpg', category: 'Professional' },

    // Cromax
    { id: 'cromax-vr-1120', image: '/images/products/cromax-vr-1120.jpg', category: 'Premium' },
    { id: 'cromax-710r', image: '/images/products/cromax-710r.jpg', category: 'Premium' },

    // Standox
    { id: 'standox-k9600-xtreme', image: '/images/products/standox-k9600-xtreme.jpg', category: 'Premium' },
    { id: 'standox-k9510-easy', image: '/images/products/standox-k9510-easy.jpg', category: 'Premium' },

    // Duxone
    { id: 'duxone-dx48', image: '/images/products/duxone-dx48.jpg', category: 'Professional' },
    { id: 'duxone-dx64', image: '/images/products/duxone-dx64.jpg', category: 'Professional' },

    // Hempel
    { id: 'hempel-zinc-17360', image: '/images/products/hempel-zinc-17360.jpg', category: 'Industrial' },
    { id: 'hempel-underwater-primer', image: '/images/products/hempel-underwater-primer.jpg', category: 'Industrial' },

    // FIAC
    { id: 'fiac-500-industrial-black', image: '/images/products/fiac-500-industrial-black.jpg', category: 'Equipment' },
    { id: 'fiac-500-silver', image: '/images/products/fiac-500-silver.jpg', category: 'Equipment' },

    // EP Vernici
    { id: 'epvernici-vrap', image: '/images/products/epvernici-vrap.jpg', category: 'Industrial' },
    { id: 'epvernici-vprl', image: '/images/products/epvernici-vprl.jpg', category: 'Industrial' },

    // JBM
    { id: 'jbm-7-drawer-trolley', image: '/images/products/jbm-7-drawer-trolley.jpg', category: 'Equipment' },
    { id: 'jbm-modular-storage', image: '/images/products/jbm-modular-storage.jpg', category: 'Equipment' },

    // Master DiChem
    { id: 'masterdichem-acrilprimer-gold', image: '/images/products/masterdichem-acrilprimer-gold.jpg', category: 'Professional' },
    { id: 'masterdichem-sigil-metal', image: '/images/products/masterdichem-sigil-metal.jpg', category: 'Professional' },

    // Mirka
    { id: 'mirka-deros-680', image: '/images/products/mirka-deros-680.jpg', category: 'Equipment' },
    { id: 'mirka-abranet', image: '/images/products/mirka-abranet.jpg', category: 'Professional' },

    // Sherwin-Williams
    { id: 'shw-wood-basecoat', image: '/images/products/shw-wood-basecoat.jpg', category: 'Premium' },
    { id: 'shw-wood-topcoat', image: '/images/products/shw-wood-topcoat.jpg', category: 'Premium' },

    // Telwin
    { id: 'telwin-smart-inductor-5000', image: '/images/products/telwin-smart-inductor-5000.jpg', category: 'Equipment' },
    { id: 'telwin-aqua-inductor-6000', image: '/images/products/telwin-aqua-inductor-6000.jpg', category: 'Equipment' },

    // Troton
    { id: 'troton-light-putty', image: '/images/products/troton-light-putty.jpg', category: 'Professional' },
    { id: 'troton-bold-putty', image: '/images/products/troton-bold-putty.jpg', category: 'Professional' }
  ];

  const featuredProducts: Product[] = productConfigs.map((cfg) => {
    const features = (t.raw(`productsData.${cfg.id}.features`) as string[]) || [];
    return {
      id: cfg.id,
      name: t(`productsData.${cfg.id}.name`),
      description: t(`productsData.${cfg.id}.description`),
      image: cfg.image,
      category: cfg.category,
      features
    };
  });

  const displayProducts = maxProducts ? featuredProducts.slice(0, maxProducts) : featuredProducts;

  // Map each product to its provider website for detailed information
  const getProviderUrl = (productId: string): string => {
    const id = productId.toLowerCase();
    if (id.startsWith('roberlo')) return 'https://www.roberlo.com/en';
    if (id.startsWith('cromax')) return 'https://www.cromax.com/eu/en_GB/products.html';
    if (id.startsWith('standox')) return 'https://www.standox.com';
    if (id.startsWith('duxone')) return 'https://www.axalta.com/duxone_corporate/en_GB.html';
    if (id.startsWith('hempel')) return 'https://www.hempel.com/products';
    if (id.startsWith('fiac')) return 'https://web.fiac.it/en/';
    if (id.startsWith('epvernici')) return 'https://www.epvernici.it/prodotti';
    if (id.startsWith('jbm')) return 'https://jbmcamp.com/en/';
    if (id.startsWith('masterdichem')) return 'https://www.dichemitaly.com';
    if (id.startsWith('mirka')) return 'https://www.mirka.com/en/products';
    if (id.startsWith('shw')) return 'https://www.sherwin-williams.com/na/en/industrial-wood';
    if (id.startsWith('telwin')) return 'https://www.telwin.com/en/products';
    if (id.startsWith('troton')) return 'https://www.troton.pl/en/products/';
    return '/brands';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05
    }
  };

  return (
    <section className={`relative z-10 ${isHomepage ? 'py-16 md:py-20' : 'py-20 md:py-24'}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block relative mb-6">
            <h2 className={`${isHomepage ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold text-white mb-4 font-montserrat`}>
              {t('title')}
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-millo-blue via-millo-red to-millo-gold rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className={`grid gap-8 items-stretch ${isHomepage ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              className="group relative h-full"
            >
              {/* Glassmorphism Card */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-white/20 flex flex-col h-full">


                {/* Product Image */}
                <div className="relative h-64 md:h-72 overflow-hidden">
                  <motion.div
                    variants={imageVariants}
                    whileHover="hover"
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </motion.div>
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Hover Features Preview */}
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-white text-sm font-medium mb-2">{t('keyFeatures')}:</p>
                      <ul className="text-white/90 text-xs space-y-1">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-1 h-1 bg-millo-gold rounded-full mr-2 flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 font-montserrat group-hover:text-millo-blue transition-colors duration-300">
                    {product.name}
                  </h3>
                  
                  <p className="text-white/70 mb-4 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  {/* Features List (Desktop) */}
                  <div className="hidden md:block mb-6">
                    <ul className="space-y-2">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-white/60">
                          <div className="w-1.5 h-1.5 bg-millo-gold rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Learn More Button */}
                  <motion.a
                    href={getProviderUrl(product.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center text-millo-gold hover:text-white font-semibold transition-colors duration-300 group mt-auto"
                  >
                    <span>{t('learnMore')}</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.a>
                </div>

                {/* Premium Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-millo-blue/10 via-transparent to-millo-red/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action (Homepage Only) */}
        {isHomepage && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center bg-gradient-to-r from-millo-blue to-millo-red text-white font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 font-montserrat"
              >
                <span className="mr-3">{t('viewAllProducts')}</span>
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-millo-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-millo-red/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
