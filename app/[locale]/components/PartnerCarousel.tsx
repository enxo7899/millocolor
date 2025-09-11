'use client';

import './PartnerCarousel.css';
import { useState, useRef, useEffect } from 'react';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPartner, setHoveredPartner] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobileInteracting, setIsMobileInteracting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if device is mobile - only on client side
  useEffect(() => {
    setIsClient(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      // Clear timeout on cleanup
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle visibility changes to ensure animation resumes when user returns
  useEffect(() => {
    if (!isClient || !isMobile) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // If page becomes visible and carousel is paused, reset it after a short delay
        if (isPaused || isDragging || isMobileInteracting) {
          setTimeout(() => {
            resetCarouselState();
          }, 500);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isClient, isMobile, isPaused, isDragging, isMobileInteracting]);

  const handleMouseEnter = () => {
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    onHoverChange?.(false);
  };

  const handlePartnerHover = (partnerId: number) => {
    setHoveredPartner(partnerId);
  };

  const handlePartnerLeave = () => {
    setHoveredPartner(null);
  };

  // Function to reset carousel to running state
  const resetCarouselState = () => {
    setIsDragging(false);
    setIsPaused(false);
    setIsMobileInteracting(false);
    setDragOffset(0);
    setTouchStart(null);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Function to start timeout for auto-resume
  const startAutoResumeTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (isMobile && (isPaused || isDragging || isMobileInteracting)) {
        resetCarouselState();
      }
    }, 2000); // Auto-resume after 2 seconds of inactivity
  };

  // Touch handlers for mobile swiping/dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isClient || !isMobile) return;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
    setIsDragging(true);
    setIsMobileInteracting(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isClient || !isMobile || !isDragging || !touchStart) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const deltaX = currentTouch - touchStart;
    
    setDragOffset(deltaX);
    
    // Prevent default scrolling behavior
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isClient || !isMobile) return;
    
    // Reset states immediately
    resetCarouselState();
    
    // Start timeout to ensure animation resumes even if user interacts with other elements
    startAutoResumeTimeout();
  };

  // Mouse handlers for desktop dragging (optional)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isClient || !isMobile) return;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setTouchStart(e.clientX);
    setIsPaused(true);
    setIsDragging(true);
    setIsMobileInteracting(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isClient || !isMobile || !isDragging || !touchStart) return;
    
    const deltaX = e.clientX - touchStart;
    setDragOffset(deltaX);
  };

  const handleMouseUp = () => {
    if (!isClient || !isMobile) return;
    
    // Reset states immediately
    resetCarouselState();
    
    // Start timeout to ensure animation resumes
    startAutoResumeTimeout();
  };

  return (
    <div 
      className={`partner-carousel-wrapper ${isPaused ? 'paused' : ''} ${isDragging ? 'dragging' : ''}`}
      ref={carouselRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="partner-carousel-container"
        ref={containerRef}
        style={{
          transform: isClient && isMobile && isDragging ? `translateX(${dragOffset}px)` : 'none',
          transition: isClient && isMobile && !isDragging ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {partners.map((partner) => (
          <div 
            key={partner.id} 
            className={`partner-carousel-item ${
              (isMobile && isMobileInteracting) || (!isMobile && hoveredPartner === partner.id) ? 'hovered' : ''
            } ${
              !isMobile && hoveredPartner && hoveredPartner !== partner.id ? 'dimmed' : ''
            }`}
            style={{ '--n': partner.id } as React.CSSProperties}
            onMouseEnter={() => isClient && !isMobile && handlePartnerHover(partner.id)}
            onMouseLeave={() => isClient && !isMobile && handlePartnerLeave()}
          >
            <a href={partner.url} target="_blank" rel="noopener noreferrer">
              <img src={partner.logo} alt={partner.name} className="partner-logo" />
            </a>
          </div>
        ))}
        {partners.map((partner, index) => (
          <div 
            key={`duplicate-${index}`} 
            className={`partner-carousel-item ${
              (isMobile && isMobileInteracting) || (!isMobile && hoveredPartner === partner.id) ? 'hovered' : ''
            } ${
              !isMobile && hoveredPartner && hoveredPartner !== partner.id ? 'dimmed' : ''
            }`}
            style={{ '--n': partners.length + index + 1 } as React.CSSProperties}
            onMouseEnter={() => isClient && !isMobile && handlePartnerHover(partner.id)}
            onMouseLeave={() => isClient && !isMobile && handlePartnerLeave()}
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
