/**
 * Contact Information Configuration
 * Centralized contact details for MilloColor
 * Update these values to maintain consistency across the site
 */

export const contactInfo = {
  // Primary contact email
  email: 'info@millocolor.com',
  
  // Primary contact phone (Albanian format)
  phone: '+355686017350',
  
  // WhatsApp number (international format without +)
  whatsapp: '355686017350',
  
  // Google Maps URL for Tirana Headquarters
  googleMapsUrl: 'https://www.google.com/maps/place/Millocolor+Shpk+-+Tiranë/@41.3701187,19.6853582,17z/data=!3m1!4b1!4m6!3m5!1s0x13502fe0f91a2731:0x316865c77b4b7231!8m2!3d41.3701147!4d19.6879331!16s%2Fg%2F11g0j9kxkk?entry=ttu&g_ep=EgoyMDI1MDkxNy4wIKXMDSoASAFQAw%3D%3D',
  
  // Physical address
  address: {
    street: 'Tiranë - Durrës km8',
    city: 'Tirana',
    country: 'Albania',
    full: 'Tiranë - Durrës km8, Tirana, Albania'
  },
  
  // Business hours
  hours: {
    weekdays: 'Monday - Friday: 8:00 - 16:30',
    saturday: 'Saturday: 8:00 - 15:00',
    sunday: 'Sunday: Closed'
  },
  
  // Social media links (optional)
  social: {
    facebook: 'https://facebook.com/millocolor',
    instagram: 'https://instagram.com/millocolor',
    linkedin: 'https://linkedin.com/company/millocolor'
  }
} as const;

// Helper functions for generating contact links
export const generateContactLinks = {
  email: (subject?: string, body?: string) => {
    const params = new URLSearchParams();
    if (subject) params.append('subject', `[MilloColor] ${subject}`);
    if (body) params.append('body', body);
    return `mailto:${contactInfo.email}${params.toString() ? '?' + params.toString() : ''}`;
  },
  
  phone: () => `tel:${contactInfo.phone}`,
  
  whatsapp: (message?: string) => {
    const params = new URLSearchParams();
    if (message) params.append('text', message);
    return `https://wa.me/${contactInfo.whatsapp}${params.toString() ? '?' + params.toString() : ''}`;
  },
  
  maps: () => contactInfo.googleMapsUrl
};

// Default contact form template
export const defaultContactForm = {
  subject: 'Contact from MilloColor Website',
  body: `Hello MilloColor Team,

I am interested in your services and would like to discuss:

[Please provide details about your inquiry]

Best regards,
[Your Name]`
};