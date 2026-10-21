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
       * public/ 아래 정적 HTML은 Astro가 페이지로 보지 않아 sitemap에 자동으로 안 들어간다.
       * 닥터지우 랜딩과 하위 페이지(모두 robots index,follow)를 직접 넣는다.
       * noindex로 바꾸면 여기서도 빼야 한다.
       */
      customPages: [
        'https://doctoryoon.kr/doctorjiwoo/',
        'https://doctoryoon.kr/doctorjiwoo/privacy/',
        'https://doctoryoon.kr/doctorjiwoo/terms/',
        'https://doctoryoon.kr/doctorjiwoo/support/',
      ],
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
