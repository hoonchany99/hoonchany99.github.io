import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://doctoryoon.kr',
  trailingSlash: 'always',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      /**
       * 어떤 봇도 색인하지 않는 페이지는 sitemap에서 뺀다.
       * 넣어두면 Search Console이 "제출됨, noindex로 표시됨" 오류로 잡는다.
       *   /posts/, /posts/2/ …  글 목록과 페이지네이션 (noindex, googlebot 예외 없음)
       *   /topics/…             주제별 가이드 (noindex)
       * 개별 글 /posts/<slug>/ 는 googlebot=index라 그대로 둔다.
       */
      filter: (page) => {
        const path = new URL(page).pathname;
        if (/^\/posts\/(\d+\/)?$/.test(path)) return false;
        if (path.startsWith('/topics/')) return false;
        return true;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
