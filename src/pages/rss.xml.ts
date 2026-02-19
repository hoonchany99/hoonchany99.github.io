import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0)
  );

  return rss({
    title: '서울대 윤원장의 치과사전',
    description: '서울대 윤원장이 직접 정리하는 치아 건강 노트. 임플란트부터 잇몸 관리, 생활 습관까지 환자들이 묻는 질문을 알기 쉽게 풀어드립니다.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? '',
      link: `/posts/${post.slug}/`,
    })),
    customData: '<language>ko</language>',
  });
}
