/**
 * 소제목 구역(## 소제목)을 쓰는 용어 검사. pr-check에서 npm run check-terms로 돌려요.
 *
 * 1. 구조 검사 (소제목이 있는 모든 용어)
 *    - 첫 줄이 소제목이다 (소제목 앞에 글이 없다)
 *    - 소제목은 20자 이하이고, 용어 안에서 겹치지 않고, FAQ 질문과 같지 않다
 *    - 구역마다 문단이 하나 이상 있다
 *    - 「[근거](…)」 줄은 `[근거](https://… "기관: 내용")` 모양이고, 그 주소가 참고 자료 목록에 있다
 *      (화면에서는 이 줄이 각주 번호가 되어 참고 자료 N번으로 이어져요. 번호는 템플릿이 첫 등장 순서로 매겨요)
 *    - 질문 카드는 질문·설명·출처 주소·출처 이름이 모두 있다
 * 2. 기존 문장 검사 (scripts/term-sections-baseline.json에 올라간 용어)
 *    - baseline: 소제목을 넣기 전 사이트 글(본문·FAQ·치료 방법)을 그대로 얼려 둔 것
 *    - kept: [기존] 문장. baseline에 글자 그대로 있고, 지금 본문에도 그대로 있어야 한다
 *    - reworded: [기존→다듬음] 문장. from이 baseline에 있고, to가 지금 본문에 있어야 한다
 *    보장하는 것: kept로 적은 문장은 옛 사이트 문장과 글자가 같고 지워지지 않았다.
 *    보장하지 않는 것: 장부에 안 적은 문장이 새 문장인지 기존 문장인지(그건 PR 리뷰가 봐요).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { parseDetail, sourceUrl } from '../src/lib/termSections.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TERMS_DIR = path.resolve(__dirname, '../src/content/terms');
const BASELINE = path.resolve(__dirname, './term-sections-baseline.json');
const MAX_HEADING = 20;

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const errors: string[] = [];
const fail = (slug: string, msg: string) => errors.push(`${slug}: ${msg}`);

type Ledger = Record<string, { baseline: string; kept: string[]; reworded: { from: string; to: string }[] }>;
const ledger: Ledger = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf-8')) : {};

const sectioned = new Set<string>();

for (const file of fs.readdirSync(TERMS_DIR).filter((f) => f.endsWith('.md'))) {
  const { data } = matter(fs.readFileSync(path.join(TERMS_DIR, file), 'utf-8'));
  const slug = String(data.termSlug);
  const detail = String(data.detail ?? '');
  const parsed = parseDetail(detail);
  if (!parsed.hasSections) continue;
  sectioned.add(slug);

  if (parsed.preamble) fail(slug, `첫 줄이 소제목이 아니에요: "${parsed.preamble.slice(0, 30)}…"`);

  const faqQuestions = new Set((data.faqs ?? []).map((f: { question: string }) => norm(f.question)));
  const sourceUrls = new Set((data.sources ?? []).map((s: string | { url: string }) => sourceUrl(s as never)));
  const seen = new Set<string>();

  for (const sec of parsed.sections) {
    const h = sec.heading;
    if (h.length > MAX_HEADING) fail(slug, `소제목이 ${h.length}자예요(${MAX_HEADING}자 이하): "${h}"`);
    if (seen.has(h)) fail(slug, `소제목이 겹쳐요: "${h}"`);
    seen.add(h);
    if (faqQuestions.has(norm(h)) || faqQuestions.has(norm(h + '?')))
      fail(slug, `소제목이 FAQ 질문과 같아요: "${h}"`);
    if (sec.paragraphs.length === 0) fail(slug, `내용이 없는 구역: "${h}"`);
    if (sec.source && !sourceUrls.has(sec.source.url))
      fail(slug, `「${h}」의 근거 주소가 참고 자료 목록에 없어요: ${sec.source.url}`);
  }

  // 질문 카드: 질문·설명·출처(주소와 이름)가 모두 있어야 각주로 이어져요
  for (const card of (data.askCards ?? []) as { question?: string; explanation?: string; sourceUrl?: string; sourceLabel?: string }[]) {
    if (!card.question || !card.explanation || !card.sourceUrl || !card.sourceLabel)
      fail(slug, `질문 카드에 빠진 칸이 있어요: ${card.question ?? '(질문 없음)'}`);
  }

  // 근거 줄 모양이 틀려 문단으로 읽힌 경우를 잡는다
  for (const sec of parsed.sections)
    for (const p of sec.paragraphs)
      if (p.startsWith('[근거]')) fail(slug, `근거 줄 모양이 틀려요(소제목 「${sec.heading}」): ${p.slice(0, 40)}`);

  const entry = ledger[slug];
  if (entry) {
    const now = norm(parsed.sections.map((s) => s.paragraphs.join(' ')).join(' '));
    const base = norm(entry.baseline);
    for (const s of entry.kept) {
      if (!base.includes(norm(s))) fail(slug, `[기존] 장부 문장이 옛 글에 없어요: ${s}`);
      if (!now.includes(norm(s))) fail(slug, `[기존] 문장이 본문에서 사라졌거나 바뀌었어요: ${s}`);
    }
    for (const { from, to } of entry.reworded) {
      if (!base.includes(norm(from))) fail(slug, `[기존→다듬음] from이 옛 글에 없어요: ${from}`);
      if (!now.includes(norm(to))) fail(slug, `[기존→다듬음] to가 본문에 없어요: ${to}`);
    }
  }
}

for (const slug of Object.keys(ledger)) {
  if (!sectioned.has(slug)) fail(slug, '장부에는 있는데 소제목 구역이 없어요');
}

if (errors.length) {
  console.error(`check-terms: ${errors.length}건 실패`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`check-terms: 통과 (소제목 용어 ${sectioned.size}개, 장부 ${Object.keys(ledger).length}개)`);
