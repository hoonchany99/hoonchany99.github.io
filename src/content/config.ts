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
        })
      )
      .default([]),
  }),
});

export const collections = { posts, terms };
