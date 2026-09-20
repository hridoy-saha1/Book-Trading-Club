/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  daisyui: {
    base: false,
  },
  theme: {
    extend: {
      colors: {
        // === Premium Academic Palette ===
        primary: {
          DEFAULT: '#1A2247', // deep indigo/navy
          dark: '#111633', // darker hover shade
        },
        gold: {
          DEFAULT: '#D5B26E', // muted premium gold
          dark: '#C9A55A', // hover shade
        },
        ai: {
          DEFAULT: '#4AC3B7', // teal glow for AI hints
          soft: '#4AC3B733', // translucent glow
        },

        // === Neutral System ===
        bg: {
          light: '#F8F7F3',
          dark: '#121212',
          card: '#1C1C1C',
        },
        text: {
          main: '#1A1A1A',
          muted: '#6E6E6E',
        },

        // === Status Colors ===
        success: '#4CAF50',
        error: '#D9534F',
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto'],
      },

      boxShadow: {
        subtle: '0 1px 2px rgba(0,0,0,0.05)',
        glow: '0 0 14px var(--ai-soft)', // AI glow effect
      },
    },
  },
  plugins: [],
};
