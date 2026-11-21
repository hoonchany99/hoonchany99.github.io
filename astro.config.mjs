import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { mergedTerms } from './src/data/termsMerged.ts';

export default defineConfig({
  site: 'https://doctoryoon.kr',
  trailingSlash: 'always',
  /**
   * 합쳐진 용어의 옛 주소 → 남은 주소. GitHub Pages는 서버 리디렉트가 없어서
   * Astro가 meta refresh + canonical + noindex가 든 작은 HTML을 만든다. 목록은 src/data/termsMerged.ts.
   */
  redirects: Object.fromEntries(
    Object.entries(mergedTerms).map(([from, to]) => [`/terms/${from}/`, `/terms/${to}/`])
  ),
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
