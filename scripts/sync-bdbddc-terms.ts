/**
 * bdbddc.com/encyclopedia 용어 이름·카테고리만 수집 → termsCanonical.ts 생성
 * 설명·FAQ는 termsRich.ts(수동) + termDetails/termFaqs.ts 유지
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { CanonicalTerm } from '../src/data/termsRich.ts';
import { termsRich } from '../src/data/termsRich.ts';
import {
  normalizeTermName,
  parseDisplayName,
  stubDefinition,
  toTermSlug,
} from './lib/termSlug.ts';
import { writeTermsIndex } from './lib/writeTermsIndex.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, '../src/data/termsCanonical.ts');

const BDBDDC_CATEGORIES = [
  '치료·시술',
  '치과 질환',
  '치수·치아 질환',
  '치주 질환',
  '구강내과 질환',
  '구강 점막 질환',
  '구강 관리',
  '치아 구조',
  '치과 재료',
  '장비·기술',
  '전문 용어',
  '교정',
  '심미 치과',
  '신경치료',
  '임플란트',
  '보철',
  '소아 치과',
  '디지털 치과',
  '마취·진정',
  '턱관절·구강외과',
  '여성·임산부 치과',
  '전신 건강',
  '보험·비용',
];

const CATEGORY_TO_TOPIC: Record<string, CanonicalTerm['topicSlug']> = {
  '치료·시술': 'cavity',
  '치과 질환': 'gum-prevention',
  '치수·치아 질환': 'cavity',
  '치주 질환': 'gum-prevention',
  '구강내과 질환': 'gum-prevention',
  '구강 점막 질환': 'gum-prevention',
  '구강 관리': 'gum-prevention',
  '치아 구조': 'cavity',
  '치과 재료': 'crown-inlay',
  '장비·기술': 'crown-inlay',
  '전문 용어': 'gum-prevention',
  교정: 'laminate-whitening',
  '심미 치과': 'laminate-whitening',
  신경치료: 'cavity',
  임플란트: 'implant',
  보철: 'crown-inlay',
  '소아 치과': 'gum-prevention',
  '디지털 치과': 'crown-inlay',
  '마취·진정': 'implant',
  '턱관절·구강외과': 'wisdom-tooth',
  '여성·임산부 치과': 'gum-prevention',
  '전신 건강': 'gum-prevention',
  '보험·비용': 'gum-prevention',
};

interface BdbddcTerm {
  rawName: string;
  path: string;
  category: string;
}

async function fetchBdbddcTerms(): Promise<BdbddcTerm[]> {
  const byName = new Map<string, BdbddcTerm>();

  for (const category of BDBDDC_CATEGORIES) {
    const url = `https://bdbddc.com/encyclopedia/category/${encodeURIComponent(category)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[warn] ${category}: HTTP ${res.status}`);
      continue;
    }
    const html = await res.text();
    const re = /\/encyclopedia\/([^"'<>]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      const p = decodeURIComponent(m[1]).trim();
      if (!p || p.startsWith('category')) continue;
      const rawName = p.replace(/-/g, ' ');
      // path가 URL 인코딩 전 원문인 경우가 많음 — HTML 내 링크는 인코딩됨
      const nameFromPath = decodeURIComponent(m[1]);
      const termPath = nameFromPath;
      // 카드 제목은 HTML "name" 필드에서 — 보조로 path 사용
      const key = normalizeTermName(nameFromPath);
      if (!byName.has(key)) {
        byName.set(key, { rawName: nameFromPath, path: termPath, category });
      }
    }

    // HTML JSON name 필드 (카드 제목)
    for (const nm of html.matchAll(/"name":"((?:\\.|[^"\\])*)"/g)) {
      const rawName = JSON.parse(`"${nm[1]}"`) as string;
      if (rawName.length < 2 || rawName.length > 80) continue;
      if (/홈|치과 백과|서울비디|카테고리|FAQ|상담|예약|검색 결과|감수|목록|어떤 용어|어떻게 해야|누가 감수|관련 진료|관련 정보/.test(rawName)) continue;
      const key = normalizeTermName(rawName);
      if (!byName.has(key)) {
        byName.set(key, {
          rawName,
          path: rawName,
          category,
        });
      } else {
        const existing = byName.get(key)!;
        existing.rawName = rawName;
        existing.path = rawName;
      }
    }
  }

  return [...byName.values()].sort((a, b) => a.rawName.localeCompare(b.rawName, 'ko'));
}

function buildRichIndex(rich: CanonicalTerm[]): Map<string, CanonicalTerm> {
  const map = new Map<string, CanonicalTerm>();
  for (const term of rich) {
    map.set(normalizeTermName(term.name), term);
    for (const alias of term.aliases) {
      map.set(normalizeTermName(alias), term);
    }
  }
  return map;
}

function renderTerm(term: CanonicalTerm): string {
  const aliasLines = term.aliases.map((a) => `    ${JSON.stringify(a)},`).join('\n');
  return `  {
    slug: ${JSON.stringify(term.slug)},
    name: ${JSON.stringify(term.name)},
    aliases: [
${aliasLines}
    ],
    topicSlug: ${JSON.stringify(term.topicSlug)},
    definition: ${JSON.stringify(term.definition)},
  }`;
}

async function main() {
  console.log('Fetching bdbddc terms...');
  const bdbddc = await fetchBdbddcTerms();
  console.log(`bdbddc unique terms: ${bdbddc.length}`);

  const richIndex = buildRichIndex(termsRich);
  const usedSlugs = new Set<string>(termsRich.map((t) => t.slug));
  const merged: CanonicalTerm[] = [];
  const seenNormalized = new Set<string>();

  // rich terms first (preserve order)
  for (const term of termsRich) {
    merged.push(term);
    seenNormalized.add(normalizeTermName(term.name));
    for (const a of term.aliases) seenNormalized.add(normalizeTermName(a));
  }

  let added = 0;
  let matched = 0;

  for (const item of bdbddc) {
    const { name, aliases } = parseDisplayName(item.rawName);
    const norm = normalizeTermName(name);

    const rich = richIndex.get(norm);
    if (rich) {
      matched++;
      continue;
    }
    if (seenNormalized.has(norm)) continue;

    seenNormalized.add(norm);
    for (const a of aliases) seenNormalized.add(normalizeTermName(a));

    const slug = toTermSlug(name, item.path, usedSlugs);
    const topicSlug = CATEGORY_TO_TOPIC[item.category] ?? 'gum-prevention';

    merged.push({
      slug,
      name,
      aliases: [...new Set([name, ...aliases.filter((a) => a !== name)])],
      topicSlug,
      definition: stubDefinition(name),
    });
    added++;
  }

  merged.sort((a, b) => a.name.localeCompare(b.name, 'ko'));

  const header = `// AUTO-GENERATED by scripts/sync-bdbddc-terms.ts — 직접 수정하지 마세요
// 풀 설명이 있는 용어: src/data/termsRich.ts 편집 후 npm run sync-bdbddc-terms
import type { CanonicalTerm } from './termsRich.ts';

export type { CanonicalTerm } from './termsRich.ts';

/** bdbddc 백과 용어 이름 + termsRich 병합 (${merged.length}개) */
export const termsCanonical: CanonicalTerm[] = [
`;

  const footer = `];

export const termsBySlug = Object.fromEntries(termsCanonical.map((t) => [t.slug, t]));

export function topicLabel(slug: string): string {
  const map: Record<string, string> = {
    cavity: '충치 · 신경치료',
    implant: '임플란트',
    'crown-inlay': '크라운 · 인레이',
    'wisdom-tooth': '사랑니 · 발치',
    'laminate-whitening': '라미네이트 · 미백',
    'gum-prevention': '잇몸 · 예방',
  };
  return map[slug] ?? slug;
}
`;

  const body = merged.map(renderTerm).join(',\n');
  fs.writeFileSync(OUT_PATH, header + body + footer, 'utf-8');

  console.log(`rich: ${termsRich.length}, added stubs: ${added}, matched rich: ${matched}, total: ${merged.length}`);
  console.log(`wrote ${OUT_PATH}`);

  const indexCount = writeTermsIndex();
  console.log(`wrote public/terms-index.json (${indexCount} terms)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
