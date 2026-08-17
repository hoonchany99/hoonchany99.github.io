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
    /** 검색 매칭용 키워드 — 블로그 태그에서 뽑아 화면에는 노출하지 않는다 */
    aliases: z.array(z.string()).optional(),
    /** 진짜 동의어 — 화면 표시와 alternateName에 쓴다 */
    synonyms: z.array(z.string()).default([]),
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
    /** 앞 항목을 해야 다음이 성립하는 블록인지 (응급·단계형) */
    approachOrdered: z.boolean().default(false),
    /** 원인별 치료·대응 — 원인 한 줄 → 치료명 → 기간·횟수 */
    approach: z
      .array(
        z.object({
          when: z.string(),
          name: z.string(),
          en: z.string().optional(),
          /** 그 시술의 사전 페이지 — 사전에 있는 용어일 때만 채워진다 */
          slug: z.string().optional(),
          detail: z.string(),
        })
      )
      .default([]),
    /** 내용 확인에 사용한 참고 자료 URL */
    sources: z.array(z.string()).default([]),
    /** 내용을 마지막으로 정리한 날짜 YYYY-MM-DD */
    updated: z.string().optional(),
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
