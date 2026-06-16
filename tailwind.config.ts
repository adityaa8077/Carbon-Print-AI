import type { Config } from 'tailwindcss';

/**
 * Design tokens for Carbon Print AI — "Cyber-Biophilic" style, Sustainability/ESG palette.
 * Keep these in sync with the CSS custom properties in src/app/globals.css.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        secondary: '#06b6d4',
        accent: '#6366f1',
        surface: '#131a26',
        ink: '#f1f5f9',
        warning: '#f59e0b',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
