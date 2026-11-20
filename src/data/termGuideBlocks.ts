import type { TermAskCard, TermCompare } from '../lib/termSections.ts';
import pilotNewBlocks from './pilotNewBlocks.json' with { type: 'json' };

/**
 * 소제목 용어(시범 10개)의 새 블록 데이터.
 *
 * - pilotNewBlocks.json: 원장님 검토를 거친 「헷갈리는 말과 차이」 표, 「진료실에서 물어볼 것」 질문, 분야.
 *   모양: { 슬러그: { category, compare: { headers, rows }, clinicQuestions: [{ q, a, source: { url, title } }] } }
 *   비어 있는 칸은 화면에 그 블록이 나오지 않아요.
 * - termReviewedBySlug: 원장님이 최종 화면을 보고 감수한 날짜(YYYY-MM-DD). 머지하는 날 채워요. 비어 있으면
 *   한눈에 보기·글쓴이 카드에 「감수 예정」으로 나와요.
 */
interface RawBlocks {
  category?: string;
  compare?: { title?: string; headers?: string[]; rows?: unknown[] };
  clinicQuestions?: { q: string; a: string; citeAfter?: number; source?: { url: string; title: string } }[];
}
const raw = pilotNewBlocks as Record<string, RawBlocks>;

function toCompare(c: RawBlocks['compare']): TermCompare | undefined {
  if (!c?.rows?.length) return undefined;
  const headers = c.headers ?? [];
  const rows = (c.rows as unknown[]).map((r) => {
    if (Array.isArray(r)) {
      const cells = r.map(String);
      return { label: cells[0], cells: cells.slice(1) };
    }
    const o = r as { label?: string; cells?: string[] };
    return { label: String(o.label ?? ''), cells: (o.cells ?? []).map(String) };
  });
  const width = rows[0]?.cells.length ?? 0;
  // 머리글에 빈 첫 칸이 들어 있으면 떼어 내고, 칸 수가 맞게 맞춘다
  const columns = headers.length > width ? headers.slice(headers.length - width) : headers;
  return { title: c.title ?? '헷갈리는 말과 차이', columns, rows };
}

export const termCompareBySlug: Record<string, TermCompare> = {};
export const termAskCardsBySlug: Record<string, TermAskCard[]> = {};
export const termCategoryOverrideBySlug: Record<string, string> = {};

for (const [slug, b] of Object.entries(raw)) {
  const compare = toCompare(b.compare);
  if (compare) termCompareBySlug[slug] = compare;
  const cards = (b.clinicQuestions ?? [])
    .filter((q) => q.source?.url)
    .map((q) => ({ question: q.q, explanation: q.a, sourceLabel: q.source!.title, sourceUrl: q.source!.url, citeAfter: q.citeAfter }));
  if (cards.length) termAskCardsBySlug[slug] = cards;
  if (b.category) termCategoryOverrideBySlug[slug] = b.category;
}

/** 감수일 (머지하는 날 채움). 지금은 모두 비어 있어요. */
export const termReviewedBySlug: Record<string, string> = {
  extraction: '2026-11-21',
  'occlusal-adjustment': '2026-11-21',
  'yebangjeog-hangsaengje': '2026-11-21',
  'sangagdong-geosangsul-habbyeongjeung': '2026-11-21',
  'simhyeolgwan-hwanja-chigwa': '2026-11-21',
};
