import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { termsCanonical } from '../src/data/termsCanonical.ts';
import { termsExtra } from '../src/data/termsExtra.ts';
import { termFaqsBySlug, FAQ_COUNT } from '../src/data/termFaqs.ts';
import { termDetailsBySlug } from '../src/data/termDetails.ts';
import { authoredBySlug } from '../src/data/termsAuthored.ts';
import { excludedSlugs } from '../src/data/termsExcluded.ts';
import { termNamesEn } from '../src/data/termNamesEn.ts';
import { termSynonyms } from '../src/data/termSynonyms.ts';
import { termApproaches } from '../src/data/termApproaches.ts';
import { writeTermsIndex } from './lib/writeTermsIndex.ts';

/** 검색·트래픽 우선순위 (기존 md tier 유지용) */
const termTier: Record<string, 'A' | 'B'> = {
  cavity: 'A',
  'root-canal': 'A',
  implant: 'A',
  'wisdom-tooth': 'A',
  scaling: 'A',
  periodontitis: 'A',
  laminate: 'A',
  crown: 'A',
  whitening: 'A',
  inlay: 'A',
  'primary-tooth': 'A',
  'cracked-tooth': 'A',
  denture: 'A',
  'impacted-tooth': 'A',
  pericoronitis: 'A',
  malocclusion: 'A',
  calculus: 'A',
  'root-canal-re': 'A',
  invisalign: 'A',
  gbr: 'A',
  'all-on-4': 'A',
  tmd: 'A',
  'dental-checkup': 'A',
  'immediate-implant': 'A',
  cerec: 'A',
};

/**
 * bdbddc에서 긁어온 목록(termsCanonical)에 우리가 추가한 표제어(termsExtra)를 합친다.
 * termsCanonical.ts는 자동 생성이라 직접 고치면 다음 동기화 때 지워진다.
 */
const allTerms = [...termsCanonical, ...termsExtra];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, '../src/content/posts');
const TERMS_DIR = path.resolve(__dirname, '../src/content/terms');

/** '함께 보면 좋은 용어' 노출 개수 */
const RELATED_TERM_COUNT = 4;

/** '관련 블로그 글' 노출 개수 */
const RELATED_POST_COUNT = 5;

/**
 * 사전 내용을 마지막으로 정리한 날짜.
 * 자동 생성 때마다 오늘 날짜를 넣으면 실제로 바뀌지 않았는데도 최신인 척하게 된다.
 * 그래서 내용을 실제로 손봤을 때만 이 값을 올린다.
 */
const CONTENT_UPDATED = '2026-08-16';

/**
 * 관련 글로 붙이기 위한 최소 관련도.
 * 이 아래는 주제가 스치기만 한 글이라, 의료 정보 페이지에 '관련 글'로
 * 내보내면 링크 하나 얻고 신뢰를 잃는다. 없는 편이 낫다.
 */
const MIN_POST_SCORE = 10;

interface PostRecord {
  slug: string;
  title: string;
  tags: string[];
  description?: string;
  tldr?: string;
  date?: Date;
  image?: string;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '');
}

/**
 * 용어와 글의 관련도.
 *
 * 방향이 중요하다. 글 쪽이 용어를 담고 있으면 그 글은 용어를 다룬 글이지만,
 * 반대로 용어가 글의 키워드를 담고 있는 건 상위 개념이 겹칠 뿐이다.
 * ('박리성 치은염'이 '치은염'을 담았다고 일반 치은염 글이 관련 글은 아니다)
 * 그래서 역방향은 약하게만 센다.
 */
function scorePost(post: PostRecord, aliases: string[], name: string): number {
  let score = 0;
  const allKeys = [name, ...aliases];

  for (const tag of post.tags) {
    const nTag = normalize(tag);
    for (const key of allKeys) {
      const nKey = normalize(key);
      if (nTag === nKey || nTag.includes(nKey)) score += 3;
      else if (nKey.includes(nTag)) score += 1;
    }
  }

  const nTitle = normalize(post.title);
  for (const key of allKeys) {
    if (nTitle.includes(normalize(key))) score += 5;
  }

  return score;
}

function loadPosts(): PostRecord[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        tags: (data.tags as string[] | undefined) ?? [],
        description: data.description as string | undefined,
        tldr: data.tldr as string | undefined,
        date: data.date ? new Date(data.date) : undefined,
        image: (data.image as { path?: string } | undefined)?.path,
      };
    });
}

/** 용어명 문자 bi-gram — '교정 발치'/'교정 왁스'처럼 계열이 같은 용어를 묶는 용도 */
function bigrams(name: string): Set<string> {
  const s = normalize(name);
  const out = new Set<string>();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
}

function overlapCount(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const g of a) if (b.has(g)) n++;
  return n;
}

/**
 * 치료명 → 그 시술의 사전 페이지 슬러그.
 *
 * 사전에 실제로 있는 용어만 건다. 짐작으로 걸면 "르포트 I 상악 골절단술"이
 * 해부 용어 "상악"으로 가는 식의 엉뚱한 링크가 생긴다.
 * 그래서 부분 일치는 쓰지 않고 이름이 정확히 같을 때만 연결한다.
 *   "치근활택술 (SRP)"        → 괄호를 떼고 "치근활택술"로 일치
 *   "교합 조정"               → 공백을 떼고 "교합조정"으로 일치
 *   "신경치료 후 크라운"       → 일치 없음 → 링크 없음
 *   "스케일링 · 치주 치료"     → 구분자로 갈라 "스케일링"에 일치
 */
function resolveApproachSlug(name: string, selfSlug: string): string | null {
  const norm = (s: string) => s.replace(/\([^)]*\)/g, '').replace(/\s/g, '').trim();
  const candidates = [name, ...name.split(/[+·/]/)].map(norm).filter(Boolean);

  for (const candidate of candidates) {
    const hit = allTerms.find((t) => {
      if (t.slug === selfSlug || !hasVerifiedContent(t.slug)) return false;
      // 표제어뿐 아니라 선별된 동의어와도 맞춘다.
      // "교합안정장치 (스플린트)" 는 표제어가 「스플린트」라 동의어로만 걸린다.
      if (norm(t.name) === candidate) return true;
      return (termSynonyms[t.slug] ?? []).some((s) => norm(s) === candidate);
    });
    if (hit) return hit.slug;
  }
  return null;
}

/**
 * 함께 보면 좋은 용어 — 같은 블로그 글로 매칭된 용어를 우선하고,
 * 부족하면 용어명이 겹치는 순으로 채운다. (기존 topicHub 분류 대체)
 */
function pickRelatedTerms(
  slug: string,
  postSlugsByTerm: Map<string, Set<string>>,
  gramsByTerm: Map<string, Set<string>>
): string[] {
  const mine = postSlugsByTerm.get(slug) ?? new Set<string>();
  const myGrams = gramsByTerm.get(slug) ?? new Set<string>();

  /**
   * 치료 블록에 실제로 등장하는 술식은 가장 확실한 관련 용어다.
   * 거미스마일은 다른 용어와 글자가 하나도 안 겹쳐 폴백으로 빠지는데,
   * 치료 블록에 "치관 연장술"이 적혀 있으면 그게 곧 정답이다.
   */
  const fromApproach: string[] = [];
  const approachText = (termApproaches[slug] ?? [])
    .map((a) => `${a.name} ${a.detail}`)
    .join(' ')
    .replace(/\s/g, '');
  if (approachText) {
    for (const t of allTerms) {
      if (t.slug === slug || !hasVerifiedContent(t.slug)) continue;
      if (approachText.includes(t.name.replace(/\s/g, ''))) fromApproach.push(t.slug);
    }
  }

  const picked = allTerms
    // 페이지가 있는 용어끼리만 연결한다 — 없는 슬러그를 걸면 링크가 통째로 사라진다
    .filter((t) => t.slug !== slug && hasVerifiedContent(t.slug))
    .map((t) => {
      const shared = overlapCount(mine, postSlugsByTerm.get(t.slug) ?? new Set());
      const nameScore = overlapCount(myGrams, gramsByTerm.get(t.slug) ?? new Set());
      return { slug: t.slug, score: shared * 10 + nameScore };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .map((t) => t.slug);

  // 치료 블록에서 뽑은 술식을 앞에 세운다
  picked.unshift(...fromApproach.filter((s) => !picked.includes(s)));
  picked.length = Math.min(picked.length, RELATED_TERM_COUNT);

  // 겹치는 신호가 없는 용어는 링크가 하나도 안 남는다 — 핵심 용어로 채운다
  if (picked.length < RELATED_TERM_COUNT) {
    for (const coreSlug of Object.keys(termTier)) {
      if (picked.length >= RELATED_TERM_COUNT) break;
      if (coreSlug === slug || picked.includes(coreSlug)) continue;
      if (!hasVerifiedContent(coreSlug)) continue;
      picked.push(coreSlug);
    }
  }

  return picked;
}

/**
 * 검증된 콘텐츠가 있는 용어인지.
 * 없는 용어는 페이지를 만들지 않는다 — 빈 페이지를 색인시키지 않기 위함.
 */
function hasVerifiedContent(slug: string): boolean {
  if (excludedSlugs.has(slug)) return false;
  if (authoredBySlug[slug]) return true;
  return Boolean(termDetailsBySlug[slug] && termFaqsBySlug[slug]?.length);
}

function resolveDefinition(term: (typeof termsCanonical)[number]): string {
  return authoredBySlug[term.slug]?.definition ?? term.definition;
}

function buildFaqs(term: (typeof termsCanonical)[number]): { question: string; answer: string }[] {
  const source = authoredBySlug[term.slug]?.faqs ?? termFaqsBySlug[term.slug] ?? [];

  // 같은 질문을 채워 넣으면 FAQPage 스키마가 중복 질문으로 채워진다 — 있는 만큼만 쓴다
  const seen = new Set<string>();
  const faqs = source.filter((f) => {
    const key = normalize(f.question);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (faqs.length < FAQ_COUNT) {
    console.warn(`[warn] ${term.slug}: FAQ ${faqs.length}개 — ${FAQ_COUNT}개 미만`);
  }

  return faqs.slice(0, FAQ_COUNT);
}

function yamlQuote(s: string): string {
  return JSON.stringify(s);
}

function toYamlBlock(text: string, contentIndent = 2): string {
  const lines = text.split('\n');
  if (lines.length === 1) return yamlQuote(text);
  const pad = ' '.repeat(contentIndent);
  return `|\n${lines.map((l) => `${pad}${l}`).join('\n')}`;
}

function termFileId(slug: string): string {
  return `term-${slug}`;
}

function buildDetail(term: (typeof termsCanonical)[number]): string {
  return (
    authoredBySlug[term.slug]?.detail ??
    termDetailsBySlug[term.slug] ??
    resolveDefinition(term)
  );
}

function renderTermFile(
  term: (typeof termsCanonical)[number],
  relatedPosts: PostRecord[],
  relatedTerms: string[],
  faqs: { question: string; answer: string }[],
  detail: string
): string {
  const tier = termTier[term.slug] ?? 'B';
  const frontmatter = [
    '---',
    `name: ${yamlQuote(term.name)}`,
    `termSlug: ${term.slug}`,
    ...(termNamesEn[term.slug] ? [`en: ${yamlQuote(termNamesEn[term.slug])}`] : []),
    `tier: ${tier}`,
    'aliases:',
    ...term.aliases.map((a) => `  - ${yamlQuote(a)}`),
    ...(termSynonyms[term.slug]?.length
      ? ['synonyms:', ...termSynonyms[term.slug].map((s) => `  - ${yamlQuote(s)}`)]
      : []),
    `definition: ${toYamlBlock(resolveDefinition(term))}`,
    `detail: ${toYamlBlock(detail)}`,
    'faqs:',
    ...faqs.flatMap((f) => [
      `  - question: ${yamlQuote(f.question)}`,
      `    answer: ${toYamlBlock(f.answer, 6)}`,
    ]),
    ...(termApproaches[term.slug]?.length
      ? [
          'approach:',
          ...termApproaches[term.slug].flatMap((a) => {
            // 수동 지정이 있으면 그것을 쓰고, 없을 때만 이름으로 찾는다
            const linked = a.slug ?? resolveApproachSlug(a.name, term.slug);
            return [
              `  - when: ${yamlQuote(a.when)}`,
              `    name: ${yamlQuote(a.name)}`,
              ...(a.en ? [`    en: ${yamlQuote(a.en)}`] : []),
              ...(linked ? [`    slug: ${linked}`] : []),
              `    detail: ${toYamlBlock(a.detail, 6)}`,
            ];
          }),
        ]
      : []),
    ...(authoredBySlug[term.slug]?.sources?.length
      ? ['sources:', ...authoredBySlug[term.slug].sources.map((u) => `  - ${yamlQuote(u)}`)]
      : []),
    `updated: ${yamlQuote(CONTENT_UPDATED)}`,
    'relatedTerms:',
    ...(relatedTerms.length ? relatedTerms.map((s) => `  - ${s}`) : ['  []']),
    'relatedPosts:',
    ...(relatedPosts.length
      ? relatedPosts.flatMap((p) => [
          `  - slug: ${p.slug}`,
          `    title: ${yamlQuote(p.title)}`,
          ...(p.image ? [`    image: ${yamlQuote(p.image)}`] : []),
          ...(p.date ? [`    date: ${yamlQuote(p.date.toISOString().slice(0, 10))}`] : []),
        ])
      : ['  []']),
    '---',
    '',
  ].join('\n');

  return frontmatter;
}

function main() {
  const force = process.argv.includes('--force');
  const dryRun = process.argv.includes('--dry-run');

  if (!dryRun && !fs.existsSync(TERMS_DIR)) {
    fs.mkdirSync(TERMS_DIR, { recursive: true });
  }

  const posts = loadPosts();

  // 관련 글을 먼저 전부 계산한다 — 용어 간 연결(pickRelatedTerms)이 이 결과를 참조한다
  const relatedPostsByTerm = new Map<string, PostRecord[]>();
  for (const term of allTerms) {
    const scored = posts
      .map((post) => ({ post, score: scorePost(post, term.aliases, term.name) }))
      .filter(({ score }) => score >= MIN_POST_SCORE)
      .sort(
        (a, b) =>
          b.score - a.score ||
          (b.post.date?.valueOf() ?? 0) - (a.post.date?.valueOf() ?? 0)
      );
    relatedPostsByTerm.set(
      term.slug,
      scored.slice(0, RELATED_POST_COUNT).map(({ post }) => post)
    );
  }

  const postSlugsByTerm = new Map(
    [...relatedPostsByTerm].map(([slug, ps]) => [slug, new Set(ps.map((p) => p.slug))])
  );
  const gramsByTerm = new Map(allTerms.map((t) => [t.slug, bigrams(t.name)]));

  let created = 0;
  let skipped = 0;
  let unwritten = 0;

  for (const term of allTerms) {
    const fileId = termFileId(term.slug);
    const outPath = path.join(TERMS_DIR, `${fileId}.md`);
    const legacyPath = path.join(TERMS_DIR, `${term.slug}.md`);

    // 아직 콘텐츠를 쓰지 않은 용어 — 페이지를 만들지 않고, 남아 있던 스텁은 지운다
    if (!hasVerifiedContent(term.slug)) {
      if (!dryRun && fs.existsSync(outPath)) fs.unlinkSync(outPath);
      unwritten++;
      continue;
    }

    if (fs.existsSync(outPath) && !force) {
      skipped++;
      continue;
    }

    // posts/cavity.md 등과 id 충돌하던 구 파일명 제거
    if (fs.existsSync(legacyPath) && legacyPath !== outPath) {
      fs.unlinkSync(legacyPath);
    }

    const relatedPosts = relatedPostsByTerm.get(term.slug) ?? [];
    const relatedTerms = pickRelatedTerms(term.slug, postSlugsByTerm, gramsByTerm);
    const faqs = buildFaqs(term);
    const detail = buildDetail(term);
    const content = renderTermFile(term, relatedPosts, relatedTerms, faqs, detail);

    if (dryRun) {
      console.log(`[dry-run] ${term.slug}.md (${relatedPosts.length} posts)`);
    } else {
      fs.writeFileSync(outPath, content, 'utf-8');
      console.log(`wrote ${fileId}.md (${relatedPosts.length} related posts)`);
      created++;
    }
  }

  console.log(
    `done: ${created} written, ${skipped} skipped, ${unwritten - excludedSlugs.size} 미작성, ${excludedSlugs.size} 제외${dryRun ? ' (dry-run)' : ''}`
  );

  if (!dryRun) {
    const indexCount = writeTermsIndex();
    console.log(`wrote public/terms-index.json (${indexCount} terms)`);
  }
}

main();
