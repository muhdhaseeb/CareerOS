import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', '../../packages/ui/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#279B37',
          primaryHover: '#228531',
          secondary: '#083859',
          surface: '#FFFFFF',
          background: '#F7F7F7',
          text: '#333333',
          muted: '#6B7280',
          border: '#DDDDDD',
          error: '#C62828',
        },
      },
    },
  },
  plugins: [],
};

export default config;
