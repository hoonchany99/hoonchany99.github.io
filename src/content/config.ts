import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date().optional(),
    modifiedDate: z.date().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    tldr: z.string().optional(),
    image: z.object({
      path: z.string(),
      alt: z.string().optional(),
    }).optional(),
  }),
});

const terms = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    /** URL 경로용 (/terms/[slug]/) — posts와 파일 id 충돌 방지 */
    termSlug: z.string(),
    /** 영문명 — 한국 제도 용어 등 대응어가 없으면 비운다 */
    en: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    definition: z.string(),
    detail: z.string(),
    tier: z.enum(['A', 'B']).optional(),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .default([]),
    relatedTerms: z.array(z.string()).default([]),
    relatedPosts: z
      .array(
        z.object({
          slug: z.string(),
          title: z.string(),
          /** 카드 썸네일 (/img/posts/…) */
          image: z.string().optional(),
          /** 발행일 YYYY-MM-DD */
          date: z.string().optional(),
        })
      )
      .default([]),
  }),
});

export const collections = { posts, terms };
