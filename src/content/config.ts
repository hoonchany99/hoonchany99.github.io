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
    /** 공식(의학) 용어 — 일반어 name과 다를 때만. 그 용어 페이지의 h1에만 「name(officialName)」로 나오고 alternateName에 들어간다. 카드·목록·홈에는 name만 */
    officialName: z.string().optional(),
    /** 영문명 — 한국 제도 용어 등 대응어가 없으면 비운다 */
    en: z.string().optional(),
    /** 검색 결과용 <title> — "치은열구란? …" 처럼 검색 의도에 맞춘 문구. 없으면 "이름 (영문명)" */
    seoTitle: z.string().optional(),
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
    /** 순서 표시 방식 — sequence: 순서대로 진행 / escalate: 1단계로 충분하지 않을 때 다음 단계로. approachOrdered: true는 sequence로 취급 */
    approachMode: z.enum(["sequence", "escalate"]).optional(),
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
          /** 이 단계에서 환자가 겪는 것 — 짧은 칩 2~3개 */
          experience: z.array(z.string()).optional(),
          /** 숫자·기간의 근거 — 「근거: 이름 ↗」 링크로 보여요 */
          sources: z.array(z.object({ name: z.string(), url: z.string().url() })).optional(),
        })
      )
      .default([]),
    /** 「헷갈리는 말과 차이」 표 — 원장님 검토를 거친 내용이 있을 때만 채운다 (소제목 용어 전용) */
    compare: z
      .object({
        title: z.string(),
        columns: z.array(z.string()),
        rows: z.array(z.object({ label: z.string(), cells: z.array(z.string()) })),
      })
      .optional(),
    /** 「진료실에서 물어볼 것」 질문 카드 — 원장님 검토를 거친 내용이 있을 때만 채운다 (소제목 용어 전용) */
    askCards: z
      .array(
        z.object({
          question: z.string(),
          explanation: z.string(),
          sourceLabel: z.string(),
          sourceUrl: z.string(),
          citeAfter: z.number().optional(),
        })
      )
      .default([]),
    /** 내용 확인에 사용한 참고 자료 — URL 글자, 또는 제목을 붙인 {url, title} */
    sources: z
      .array(z.union([z.string(), z.object({ url: z.string(), title: z.string() })]))
      .default([]),
    /** 처음 정리한 날짜 YYYY-MM-DD (datePublished) */
    updated: z.string().optional(),
    /** 치과의사가 실제로 다시 검토한 날짜 YYYY-MM-DD — 검토한 뒤에만 채운다 (dateModified·lastReviewed) */
    reviewed: z.string().optional(),
    /** 설명 그림 한 장 — 원장님 감수를 거친 그림만. 새 틀(소제목)은 figureAfterSection 구역 바로 아래, 옛 틀은 「뜻과 설명」 아래에 그려요 */
    figure: z
      .object({
        /** /img/terms/… (public 아래 파일, check-terms가 존재·크기를 확인) */
        src: z.string(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        /** 그림 내용을 한국어로 설명 (필수) */
        alt: z.string().min(1),
        caption: z.string(),
        /** 출처 표기 (바탕 그림이 있을 때) */
        credit: z.string().optional(),
        creditUrl: z.string().optional(),
      })
      .optional(),
    /** 새 틀(소제목 구역)에서 그림을 놓을 구역의 소제목 이름 — 없으면 첫 구역 아래 */
    figureAfterSection: z.string().optional(),
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

/**
 * 주제별 긴 치료 가이드 (/topics/<topic>/ 한 쪽에 하나). 본문은 용어 본문(detail)과 같은 「## 소제목」·[근거](주소 "기관: 내용") 문법이고,
 * 표·체크리스트·Q&A·단계는 src/lib/topicGuide.ts가 읽어요. 참고 자료(sources)는 머리말에 둬요.
 */
const topicGuides = defineCollection({
  type: 'content',
  schema: z.object({
    /** topicHubs의 slug와 같아야 해요 */
    topic: z.string(),
    title: z.string(),
    /** 메타 설명 — 70~150자 */
    description: z.string().min(70).max(150),
    /** 발행일 YYYY-MM-DD (머지하는 날) */
    published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** 감수 날짜 YYYY-MM-DD — 없으면 「감수 예정」 */
    reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    sources: z.array(z.object({ url: z.string().url(), title: z.string() })),
  }),
});

export const collections = { posts, terms, topicGuides };
