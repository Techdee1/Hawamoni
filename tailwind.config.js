/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Hawamoni Brand Colors - Solana + Africa-inspired
        midnight: '#061024', // Primary background
        slate: '#0F1724',    // Surfaces (cards, sidebars, modals)
        muted: '#9CA3AF',    // Secondary text, metadata, placeholders
        
        // Solana Colors
        'solana-teal': '#00FFA3',    // Primary glow accent, success states
        'solana-blue': '#03E1FF',    // Links, secondary buttons, hover states
        'solana-magenta': '#DC1FFF', // Urgent accents, badges, vibrant callouts
        
        // Africa-inspired Colors
        'africa-gold': '#FFC857',    // Treasury highlights, trusted badges, premium CTAs
        'terracotta': '#D9480F',     // Alerts, event banners, warm highlights
        'olive': '#2E7A3A',          // Positive/verified states, cultural accent
        
        // Semantic color mapping using brand palette
        primary: {
          50: '#f0fffa',
          100: '#ccfff0',
          200: '#99ffe0',
          300: '#66ffd1',
          400: '#33ffc2',
          500: '#00FFA3', // Solana Teal
          600: '#00cc82',
          700: '#009962',
          800: '#006641',
          900: '#003321',
        },
        secondary: {
          50: '#f0fcff',
          100: '#ccf7ff',
          200: '#99efff',
          300: '#66e7ff',
          400: '#33dfff',
          500: '#03E1FF', // Solana Blue
          600: '#02b4cc',
          700: '#028799',
          800: '#015a66',
          900: '#012d33',
        },
        accent: {
          50: '#fdf2ff',
          100: '#f9ccff',
          200: '#f399ff',
          300: '#ed66ff',
          400: '#e733ff',
          500: '#DC1FFF', // Solana Magenta
          600: '#b019cc',
          700: '#841399',
          800: '#580c66',
          900: '#2c0633',
        },
        success: {
          50: '#f0f9f2',
          100: '#d4f0d9',
          200: '#a9e1b3',
          300: '#7dd28d',
          400: '#52c367',
          500: '#2E7A3A', // Olive
          600: '#25622e',
          700: '#1c4923',
          800: '#123117',
          900: '#09180c',
        },
        warning: {
          50: '#fff9f0',
          100: '#ffeecc',
          200: '#ffdd99',
          300: '#ffcc66',
          400: '#ffdb33',
          500: '#FFC857', // Africa Gold
          600: '#cca046',
          700: '#997834',
          800: '#665023',
          900: '#332811',
        },
        danger: {
          50: '#fef5f2',
          100: '#fce0d6',
          200: '#f9c1ad',
          300: '#f6a284',
          400: '#f3835b',
          500: '#D9480F', // Terracotta
          600: '#ae3a0c',
          700: '#822b09',
          800: '#571d06',
          900: '#2b0e03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}