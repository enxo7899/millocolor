import localFont from 'next/font/local';

// Archivo variable (weight + width axes), SIL OFL. Self-hosted.
export const displayFont = localFont({
  src: './fonts/Archivo-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-display',
  declarations: [{ prop: 'font-stretch', value: '62% 125%' }],
});
