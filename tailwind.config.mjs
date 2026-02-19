/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4CBDC4',
          light: '#6DD0D6',
          dark: '#3AA8AF',
          bg: '#f0fafb',
          50: '#edfafa',
          100: '#d5f2f4',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard Variable', 'Pretendard',
          '-apple-system', 'BlinkMacSystemFont', 'system-ui',
          'Noto Sans KR', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
