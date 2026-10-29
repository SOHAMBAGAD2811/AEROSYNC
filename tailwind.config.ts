import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // AiRA & Military Aviation Palette
        spruce: {
          DEFAULT: '#1a4d4a',
          50: '#f0f7f6',
          100: '#e8f4f3',
          200: '#c5e3e0',
          300: '#94ccc7',
          400: '#5baea7',
          500: '#2d9b8a',
          600: '#1a4d4a', // Primary core accent
          700: '#143e3c',
          800: '#0f3535',
          900: '#0a2323',
          950: '#051414',
        },
        navy: {
          hero: '#081924',
          ribbon: '#0d2737',
          card: '#0e2636',
          900: '#102a3a',
          800: '#173747',
          700: '#20465a',
        },
        gov: {
          teal: '#1a4d4a',
          emerald: '#2e7d52',
          amber: '#b46927',
          red: '#c53c30',
          blue: '#1b6488',
          gold: '#c9a52d',
        },
        base: {
          page: '#f8fafb',
          surface: '#ffffff',
          subtle: '#f1f5f7',
          muted: '#e4eaed',
        },
        ink: {
          primary: '#173747',
          secondary: '#4d606a',
          muted: '#77878f',
          subtle: '#9aa7ad',
        },
        edge: {
          DEFAULT: '#dce3e6',
          subtle: '#edf2f4',
          hover: '#bac7cc',
          focus: '#16435b',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', '"DM Sans"', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(23, 55, 71, 0.03)',
        xs: '0 1px 2px 0 rgba(23, 55, 71, 0.05)',
        sm: '0 1px 3px 0 rgba(23, 55, 71, 0.06), 0 1px 2px -1px rgba(23, 55, 71, 0.04)',
        md: '0 4px 6px -1px rgba(23, 55, 71, 0.06), 0 2px 4px -2px rgba(23, 55, 71, 0.04)',
        lg: '0 10px 15px -3px rgba(23, 55, 71, 0.07), 0 4px 6px -4px rgba(23, 55, 71, 0.03)',
        xl: '0 20px 25px -5px rgba(23, 55, 71, 0.08), 0 8px 10px -6px rgba(23, 55, 71, 0.03)',
        glow: '0 0 16px rgba(26, 77, 74, 0.12)',
        focus: '0 0 0 3px rgba(26, 77, 74, 0.15)',
      },
      borderRadius: {
        'xs': '3px',
        'sm': '5px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.015em',
        kicker: '0.08em',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
