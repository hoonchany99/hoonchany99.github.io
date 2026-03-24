import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { findTopicHub } from '../data/topicHubs';

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');

  const data = posts.map((post) => {
    const bodyText = stripHtml(post.body);
    const hub = findTopicHub(post.data.tags ?? []);

    return {
      slug: post.slug,
      title: post.data.title,
      description: post.data.description ?? '',
      bodyText: bodyText.slice(0, 800),
      tags: post.data.tags ?? [],
      topicHub: hub?.slug ?? null,
      image: post.data.image?.path ?? null,
      date: post.data.date?.toISOString() ?? null,
    };
  });

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
