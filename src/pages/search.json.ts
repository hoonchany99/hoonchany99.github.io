import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');

  const data = posts.map((post) => {
    const text = post.body
      .replace(/<[^>]+>/g, '')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const readingTime = Math.max(1, Math.round(text.length / 500));

    return {
      slug: post.slug,
      title: post.data.title,
      description: post.data.description ?? '',
      excerpt: text.slice(0, 200),
      tags: post.data.tags ?? [],
      categories: post.data.categories ?? [],
      image: post.data.image?.path ?? null,
      imageAlt: post.data.image?.alt ?? '',
      date: post.data.date?.toISOString() ?? null,
      readingTime,
    };
  });

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
