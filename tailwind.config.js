/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        'millo-red': '#d7282f',
        'millo-blue': '#004a99',
        'millo-gold': '#FFD700',
        
        // Light theme (Option A)
        light: {
          bg: '#FFFFFF',
          text: '#1A1A1A',
          neutral: '#F5F5F5',
        },
        
        // Dark theme (Option B)
        dark: {
          bg: '#0D0D0D',
          text: '#F0F0F0',
          neutral: '#272727',
          muted: '#8C8C8C',
        },
        
        // Contemporary theme (Option C)
        contemporary: {
          bg: '#FFFFFF',
          text: '#2B2B2B',
          teal: '#5D737E',
          neutral: '#ECE7E1',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Tailwind already has good defaults, but we can add specific sizes if needed
        'heading-1': ['3.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-2': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-3': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
      },
      spacing: {
        'header': '60px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'scroll-hint': 'scrollHint 2s ease-in-out infinite',
        'logo-scroll': 'logoScroll 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollHint: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
        logoScroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  // Enable dark mode based on class
  darkMode: 'class',
}
