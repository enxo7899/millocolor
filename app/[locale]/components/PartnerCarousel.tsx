'use client';

import './PartnerCarousel.css';
import { useState, useRef } from 'react';

interface PartnerCarouselProps {
  onHoverChange?: (isHovered: boolean) => void;
}

const PartnerCarousel: React.FC<PartnerCarouselProps> = ({ onHoverChange }) => {
  // Partner logos data with new companies
  const partners = [
    {
      id: 1,
      name: 'Cromax',
      logo: '/images/partners/cromax.jpg',
      url: 'https://www.cromax.com'
    },
    {
      id: 2,
      name: 'Duxone',
      logo: '/images/partners/duxone.jpg',
      url: 'https://www.axalta.com/duxone_corporate/en_GB.html'
    },
    {
      id: 3,
      name: 'EP Vernici',
      logo: '/images/partners/epvernici.jpg?v=3',
      url: 'https://www.epvernici.it'
    },
    {
      id: 4,
      name: 'Fiac',
      logo: '/images/partners/fiac.jpg',
      url: 'https://web.fiac.it'
    },
    {
      id: 5,
      name: 'Hempel',
      logo: '/images/partners/hempel.jpg',
      url: 'https://www.hempel.com'
    },
    {
      id: 6,
      name: 'JBM',
      logo: '/images/partners/jbm.jpg',
      url: 'https://jbmcamp.com/'
    },
    {
      id: 7,
      name: 'Master Dichem',
      logo: '/images/partners/masterdichem.jpg',
      url: 'https://www.dichemitaly.com'
    },
    {
      id: 8,
      name: 'Mirka',
      logo: '/images/partners/mirka.jpg',
      url: 'https://www.mirka.com'
    },
    {
      id: 9,
      name: 'Roberlo',
      logo: '/images/partners/roberlo.jpg',
      url: 'https://www.roberlo.com'
    },
    {
      id: 10,
      name: 'Rupes',
      logo: '/images/partners/RUPES.jpg',
      url: 'https://www.rupes.com'
    },
    {
      id: 11,
      name: 'Sata',
      logo: '/images/partners/sata.jpg',
      url: 'https://www.sata.com'
    },
    {
      id: 12,
      name: 'SHW',
      logo: '/images/partners/SHW.jpg',
      url: 'https://www.sherwin-williams.com/'
    },
    {
      id: 13,
      name: 'Standox',
      logo: '/images/partners/standox.jpg',
      url: 'https://www.standox.com'
    },
    {
      id: 14,
      name: 'Telwin',
      logo: '/images/partners/Telwin.jpg',
      url: 'https://www.telwin.com'
    },
    {
      id: 15,
      name: 'Troton',
      logo: '/images/partners/troton.jpg',
      url: 'https://www.troton.pl'
    }
  ];

  const carouselRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    onHoverChange?.(false);
  };

  return (
    <div 
      className="partner-carousel-wrapper"
      ref={carouselRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="partner-carousel-container">
        {partners.map((partner) => (
          <div 
            key={partner.id} 
            className="partner-carousel-item"
            style={{ '--n': partner.id } as React.CSSProperties}
          >
            <a href={partner.url} target="_blank" rel="noopener noreferrer">
              <img src={partner.logo} alt={partner.name} className="partner-logo" />
            </a>
          </div>
        ))}
        {partners.map((partner, index) => (
          <div 
            key={`duplicate-${index}`} 
            className="partner-carousel-item"
            style={{ '--n': partners.length + index + 1 } as React.CSSProperties}
          >
            <a href={partner.url} target="_blank" rel="noopener noreferrer">
              <img src={partner.logo} alt={partner.name} className="partner-logo" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerCarousel;
