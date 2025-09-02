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
    // RUPES
    { id: 'rupes-skorpio-iii', image: '/images/products/rupes-skorpio-iii-rh356.jpg', category: 'Equipment' },
    { id: 'rupes-lhr21-mark-v', image: '/images/products/rupes-bigfoot-lhr21-mark-v.jpg', category: 'Equipment' },

    // SATA
    { id: 'sata-x5500', image: '/images/products/satajet-x-5500.jpg', category: 'Equipment' },
    { id: 'sata-5000b', image: '/images/products/satajet-5000-b.jpg', category: 'Equipment' },

    // Roberlo
    { id: 'roberlo-kronox-320', image: '/images/products/roberlo-kronox-320-hs-clear.jpg', category: 'Professional' },
    { id: 'roberlo-robfill-2k', image: '/images/products/roberlo-robfill-2k-primer.jpg', category: 'Professional' },

    // Cromax
    { id: 'cromax-pro-base', image: '/images/products/cromax-pro-basecoat.jpg', category: 'Premium' },
    { id: 'cromax-cc6500', image: '/images/products/cromax-cc6500-clear.jpg', category: 'Premium' },

    // Duxone
    { id: 'duxone-dx15', image: '/images/products/duxone-dx15-basecoat.jpg', category: 'Professional' },
    { id: 'duxone-dx57', image: '/images/products/duxone-dx57-clear.jpg', category: 'Professional' },

    // EP Vernici
    { id: 'epvernici-ep200', image: '/images/products/ep-vernici-ep-200-primer.jpg', category: 'Industrial' },
    { id: 'epvernici-ep500', image: '/images/products/ep-vernici-ep-500-topcoat.jpg', category: 'Industrial' },

    // FIAC
    { id: 'fiac-ab100-268', image: '/images/products/fiac-ab100-268-compressor.jpg', category: 'Equipment' },
    { id: 'fiac-cls75', image: '/images/products/fiac-cls-7-5-screw-compressor.jpg', category: 'Equipment' },

    // Hempel
    { id: 'hempel-light-primer', image: '/images/products/hempel-light-primer.jpg', category: 'Industrial' },
    { id: 'hempel-silic-one', image: '/images/products/hempel-silic-one.jpg', category: 'Industrial' },

    // JBM
    { id: 'jbm-hvlp-gun', image: '/images/products/jbm-hvlp-spray-gun.jpg', category: 'Equipment' },
    { id: 'jbm-polisher', image: '/images/products/jbm-1200w-dual-action-polisher.jpg', category: 'Equipment' },

    // Master DiChem
    { id: 'masterdichem-primer-2k', image: '/images/products/master-dichem-primer-2k.jpg', category: 'Professional' },
    { id: 'masterdichem-clear-hs', image: '/images/products/master-dichem-hs-clearcoat.jpg', category: 'Professional' },

    // Mirka
    { id: 'mirka-deros', image: '/images/products/mirka-deros-sander.jpg', category: 'Equipment' },
    { id: 'mirka-polarshine-10', image: '/images/products/mirka-polarshine-10-compound.jpg', category: 'Professional' },

    // SHW (Sherwin‑Williams)
    { id: 'shw-ultra-7000', image: '/images/products/shw-ultra-7000-basecoat.jpg', category: 'Premium' },
    { id: 'shw-finish1-clear', image: '/images/products/shw-finish-1-clearcoat.jpg', category: 'Professional' },

    // Standox
    { id: 'standoblue-base', image: '/images/products/standox-standoblue-basecoat.jpg', category: 'Premium' },
    { id: 'standox-k9550-clear', image: '/images/products/standox-hs-clear-k9550.jpg', category: 'Premium' },

    // Telwin
    { id: 'telwin-tig-222', image: '/images/products/telwin-technology-tig-222.jpg', category: 'Equipment' },
    { id: 'telwin-smart-charger', image: '/images/products/telwin-smart-charger-pro.jpg', category: 'Equipment' },

    // Troton
    { id: 'troton-master-filler', image: '/images/products/troton-master-acryl-filler-4-1.jpg', category: 'Professional' },
    { id: 'troton-brayd-clear', image: '/images/products/troton-brayd-hs-clear.jpg', category: 'Professional' }
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
          className={`grid gap-8 ${isHomepage ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}
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
              className="group relative"
            >
              {/* Glassmorphism Card */}
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-white/20">


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
                <div className="p-6">
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
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center text-millo-gold hover:text-white font-semibold transition-colors duration-300 group"
                  >
                    <span>{t('learnMore')}</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
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