/**
 * Contact Information Configuration
 * Centralized contact details for MilloColor
 * Update these values to maintain consistency across the site
 */

export const contactInfo = {
  // Primary contact email
  email: 'info@millocolor.com',
  
  // Primary contact phone (Albanian format)
  phone: '+355 42 123 456',
  
  // WhatsApp number (international format without +)
  whatsapp: '35542123456',
  
  // Google Maps URL for Tirana Headquarters
  googleMapsUrl: 'https://maps.google.com/?q=Tirana+Albania',
  
  // Physical address
  address: {
    street: '123 Paint Street',
    city: 'Tirana',
    country: 'Albania',
    full: '123 Paint Street, Tirana, Albania'
  },
  
  // Business hours
  hours: {
    weekdays: 'Monday - Friday: 8:00 - 17:00',
    saturday: 'Saturday: 9:00 - 14:00',
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