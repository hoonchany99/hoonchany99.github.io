# 윤원장의 치과사전

임상 치과의사 윤훈찬이 직접 정리하는 치아 건강 블로그.

**[hoonchany99.github.io](https://hoonchany99.github.io)**

## Tech Stack

- [Astro](https://astro.build) — Static site generator
- [React](https://react.dev) — UI components
- [Tailwind CSS](https://tailwindcss.com) — Styling
- GitHub Pages + GitHub Actions — Deployment

## Project Structure

```
src/
├── components/      # React 컴포넌트 (Header, Hero, Footer 등)
├── content/posts/   # 블로그 글 (Markdown)
├── layouts/         # Astro 레이아웃 (BaseLayout, PostLayout)
├── pages/           # 라우트 (index, posts, about, 404)
└── styles/          # 글로벌 CSS
public/
├── img/             # 이미지 (로고, 포스트 이미지)
└── robots.txt
```

## Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # dist/ 에 정적 빌드
```

## Adding Posts

`src/content/posts/`에 마크다운 파일 추가:

```yaml
---
title: "글 제목"
date: 2026-02-13
categories: [카테고리1, 카테고리2]
tags: [태그1, 태그2]
description: "글 요약"
image:
  path: /img/posts/slug/main.png
  alt: "이미지 설명"
---
```

이미지는 `public/img/posts/slug/`에 저장.

## License

MIT
