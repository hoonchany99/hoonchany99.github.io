# Dr. Yoon's Dental Dictionary

A dental health blog by Dr. Hoonchan Yoon — reliable oral health information written by a practicing dentist.

**[doctoryoon.kr](https://doctoryoon.kr)**

## Tech Stack

- [Astro](https://astro.build) — Static site generator
- [React](https://react.dev) — UI components
- [Tailwind CSS](https://tailwindcss.com) — Styling
- GitHub Pages + GitHub Actions — Deployment

## Project Structure

```
src/
├── components/      # React components (Header, Hero, Footer, etc.)
├── content/posts/   # Blog posts (Markdown)
├── layouts/         # Astro layouts (BaseLayout, PostLayout)
├── pages/           # Routes (index, posts, about, 404)
└── styles/          # Global CSS
public/
├── img/             # Images (logo, post images, avatar)
└── robots.txt
```

## Development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # Static build to dist/
```

## Adding Posts

Add a markdown file to `src/content/posts/`:

```yaml
---
title: "Post title"
date: 2026-02-13
categories: [category1, category2]
tags: [tag1, tag2]
description: "Short summary"
image:
  path: /img/posts/slug/main.png
  alt: "Image description"
---
```

Place images in `public/img/posts/slug/`.

## License

MIT
