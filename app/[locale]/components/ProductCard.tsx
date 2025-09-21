'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  features?: string[];
  href?: string;
  category?: string;
  delay?: number;
}

/**
 * Premium interactive product card with luxury hover effects
 * Inspired by high-end automotive and tech websites
 */
const ProductCard: React.FC<ProductCardProps> = ({ 
  image, 
  title, 
  description, 
  features = [], 
  href = '#', 
  category,
  delay = 0 
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  const hoverVariants = {
    rest: { 
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1
    },
    hover: { 
      y: -15,
      rotateX: 5,
      rotateY: 5,
      scale: 1.02
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="group perspective-1000"
    >
      <motion.div
        variants={hoverVariants}
        initial="rest"
        whileHover="hover"
        className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transform-gpu"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Category Badge */}
        {category && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-millo-blue to-millo-red text-white text-xs font-semibold rounded-full"
          >
            {category}
          </motion.div>
        )}

        {/* Image Container */}
        <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center p-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="w-full h-full"
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-6 relative">
          <motion.h3 
            className="text-xl font-bold text-gray-800 mb-3 group-hover:text-millo-blue transition-colors duration-300"
            whileHover={{ x: 5 }}
          >
            {title}
          </motion.h3>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {description}
          </p>

          {/* Features List */}
          {features.length > 0 && (
            <ul className="space-y-1 mb-4">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.4 + (index * 0.1) }}
                  className="flex items-center text-sm text-gray-500"
                >
                  <div className="w-1.5 h-1.5 bg-millo-gold rounded-full mr-2 flex-shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </ul>
          )}

          {/* CTA Link */}
          <Link
            href={href}
            className="inline-flex items-center text-millo-red font-semibold text-sm hover:text-millo-blue transition-colors duration-300 group/link"
          >
            <span>Learn More</span>
            <motion.svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </Link>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-millo-gold/5 via-transparent to-millo-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            transform: 'translateZ(1px)'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
