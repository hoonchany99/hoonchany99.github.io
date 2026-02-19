/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#3FB8D3',
          light: '#5FC9DF',
          dark: '#2DA3BD',
          bg: '#eef8fb',
          50: '#e8f6fa',
          100: '#ccecf4',
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
