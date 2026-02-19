import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
    image: z.object({
      path: z.string(),
      alt: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { posts };
