'use client';

import { useState, useRef, useEffect } from 'react';

const GallerySection = () => {
  const [activeLocation, setActiveLocation] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Fix hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const locations = [
    {
      id: 1,
      name: 'Tirana Headquarters',
      country: 'Albania',
      subtitle: 'The Heart of Our Operations',
      features: ['Main Distribution Center', 'Training Facility', 'Technical Support', 'Color Consulting'],
      address: 'Rr. Skenderbeu 55, Tirana, Albania',
      phone: '+355 69 123 4567',
      email: 'tirana@millocolor.com',
      hours: 'Mon-Fri: 8:00-18:00, Sat: 9:00-14:00',
      color: 'from-blue-600 via-blue-700 to-blue-800',
      icon: '🏢',
      images: [
        '/images/1sata.jpg',
        '/images/epvernici.jpg',
        '/images/jbm.jpg',
        '/images/placeholder.svg'
      ]
    },
    {
      id: 2,
      name: 'Kosovo Branch',
      country: 'Kosovo',
      subtitle: 'Expanding Our Regional Reach',
      features: ['Regional Service Center', 'Technical Support', 'Product Distribution', 'Customer Training'],
      address: 'Rr. Nëna Terezë 23, Pristina, Kosovo',
      phone: '+383 38 123 456',
      email: 'kosovo@millocolor.com',
      hours: 'Mon-Fri: 8:00-17:00, Sat: 9:00-13:00',
      color: 'from-red-600 via-red-700 to-red-800',
      icon: '🏭',
      images: [
        '/images/1sata.jpg',
        '/images/epvernici.jpg',
        '/images/jbm.jpg',
        '/images/placeholder.svg'
      ]
    }
  ];

  // Don't render until client-side
  if (!isClient) {
    return (
      <section className="py-24 relative z-10 overflow-hidden min-h-screen">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our
              <span className="block bg-gradient-to-r from-millo-blue via-millo-red to-millo-blue bg-clip-text text-transparent">
                Locations
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              Strategic locations serving professionals across the region with state-of-the-art facilities
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative z-10 overflow-hidden min-h-screen">
      <div className="container mx-auto px-4 relative z-10">
        {/* Title Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our
            <span className="block bg-gradient-to-r from-millo-blue via-millo-red to-millo-blue bg-clip-text text-transparent">
              Locations
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Strategic locations serving professionals across the region with state-of-the-art facilities
          </p>
        </div>



        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {locations.map((location, index) => (
            <LocationCard 
              key={location.id} 
              location={location} 
              isActive={activeLocation === index}
              onToggle={() => setActiveLocation(activeLocation === index ? null : index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Visit Our Facilities
            </h3>
            <p className="text-white/70 leading-relaxed mb-6">
              Experience our state-of-the-art facilities firsthand. Schedule a visit to see our 
              equipment, meet our team, and discuss your specific needs with our experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-millo-dark-blue text-white font-semibold rounded-full hover:bg-blue-800 transition-all duration-300">
                Schedule a Visit
              </button>
              <button className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                Contact Sales Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Location Card Component with Image Carousel
const LocationCard = ({ location, isActive, onToggle }: { 
  location: any; 
  isActive: boolean; 
  onToggle: () => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll through images
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % location.images.length);
      }, 3000); // Change image every 3 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, location.images.length]);

  return (
    <div className="relative group">
      {/* Main Card */}
      <div 
        className={`relative h-96 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${
          isActive ? 'scale-105 ring-2 ring-white/30' : 'scale-100'
        }`}
        onClick={onToggle}
        style={{
          background: `linear-gradient(135deg, ${location.color.includes('blue') ? '#004a99' : '#C73834'}, ${location.color.includes('blue') ? '#0066cc' : '#e04550'})`
        }}
      >
        {/* Image Carousel Background */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {location.images.map((image: string, index: number) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={`${location.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8">
          {/* Header */}
          <div>
            <div className="text-6xl mb-4">
              {location.icon}
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-2">
              {location.name}
            </h3>
            
            <p className="text-white/80 text-lg mb-4">
              {location.subtitle}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            {location.features.map((feature: string, idx: number) => (
              <div
                key={idx}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2 rounded-full bg-white" />
                <span className="text-white/90 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-white/20" />

        {/* Image Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {location.images.map((_: string, index: number) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>
      </div>

      {/* Expanded Details Panel */}
      {isActive && (
        <div className="absolute top-full left-0 right-0 mt-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white mb-4">Contact Information</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    📍
                  </div>
                  <span className="text-white/80 text-sm">{location.address}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    📞
                  </div>
                  <span className="text-white/80 text-sm">{location.phone}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    ✉️
                  </div>
                  <span className="text-white/80 text-sm">{location.email}</span>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Business Hours</h4>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white/80 text-sm">{location.hours}</p>
              </div>
              
              <div className="mt-4">
                <button className="px-6 py-3 bg-millo-dark-blue text-white font-semibold rounded-full hover:bg-blue-800 transition-all duration-300 text-sm">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection; 