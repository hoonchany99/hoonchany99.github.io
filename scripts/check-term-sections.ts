/**
 * 소제목 구역(## 소제목)을 쓰는 용어 검사. pr-check에서 npm run check-terms로 돌려요.
 *
 * 1. 구조 검사 (소제목이 있는 모든 용어)
 *    - 첫 줄이 소제목이다 (소제목 앞에 글이 없다)
 *    - 소제목은 20자 이하이고, 용어 안에서 겹치지 않고, FAQ 질문과 같지 않다
 *    - 구역마다 문단이 하나 이상 있다
 *    - 「[근거](…)」 줄은 `[근거](https://… "기관: 내용")` 모양이고, 그 주소가 참고 자료 목록에 있다
 *      (문장 바로 뒤에 쓴 표시가 화면에서 각주 번호가 되어 참고 자료 N번으로 이어져요. 번호는 템플릿이 첫 등장 순서로 매겨요)
 *    - 각주 바로 앞 문장이 공감·안내 문장(많이 걱정되셨죠, 긴장되실 수, 자주 듣는, 불안하실 수 …)이 아니다
 *    - 질문 카드는 질문·설명·출처 주소·출처 이름이 모두 있다
 *    - 문장 안 내부 링크 `[글](/terms/<slug>/)`: 실제 있는 용어 페이지, 자기 자신 아님, 구역당 3개 이하,
 *      외부·다른 주소 없음(외부는 각주로만), 안내 상자 구역에는 없음. 설명(definition)·seoTitle·FAQ·질문 카드에는 링크 문법 없음
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
import sharp from 'sharp';
import { checkSectionLinks, fieldsWithLinks } from './lib/termLinkCheck.ts';
import { mergedTerms } from '../src/data/termsMerged.ts';
import { parseDetail, sourceUrl, splitSentences, isEmpathy } from '../src/lib/termSections.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TERMS_DIR = path.resolve(__dirname, '../src/content/terms');
const BASELINE = path.resolve(__dirname, './term-sections-baseline.json');
const MAX_HEADING = 20;

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const errors: string[] = [];
const warnings: string[] = [];
const fail = (slug: string, msg: string) => errors.push(`${slug}: ${msg}`);

type Ledger = Record<string, { baseline: string; kept: string[]; reworded: { from: string; to: string }[] }>;
const ledger: Ledger = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf-8')) : {};

const sectioned = new Set<string>();

/** 설명 그림(figure): 파일이 public 아래에 있고, 크기가 맞고, 한국어 alt·캡션이 있고, 출처 주소는 https다. 위치 구역 이름도 확인 */
const PUBLIC_DIR = path.resolve(__dirname, '../public');
function checkFigure(slug: string, data: Record<string, any>, parsed: { hasSections: boolean; sections: { heading: string }[] }) {
  const fig = data.figure;
  if (!fig) {
    if (data.figureAfterSection) fail(slug, 'figureAfterSection만 있고 figure가 없어요');
    return;
  }
  if (!String(fig.alt ?? '').trim()) fail(slug, 'figure.alt가 비었어요(그림 내용을 한국어로 설명)');
  else if (!/[가-힣]/.test(String(fig.alt))) fail(slug, 'figure.alt에 한국어가 없어요');
  if (!String(fig.caption ?? '').trim()) fail(slug, 'figure.caption이 비었어요');
  const src = String(fig.src ?? '');
  if (!src.startsWith('/img/terms/')) fail(slug, `figure.src는 /img/terms/ 아래여야 해요: ${src}`);
  else {
    const file = path.join(PUBLIC_DIR, src);
    if (!fs.existsSync(file)) fail(slug, `figure.src 파일이 없어요: ${src}`);
    else {
      const m = figSizes.get(file);
      if (m && (m.width !== fig.width || m.height !== fig.height))
        fail(slug, `figure 크기(width·height)가 파일과 달라요: 적은 ${fig.width}x${fig.height}, 파일 ${m.width}x${m.height}`);
    }
  }
  if (fig.credit && !fig.creditUrl) fail(slug, 'figure.credit에는 creditUrl(라이선스 주소)도 필요해요');
  if (fig.creditUrl && !/^https:\/\//.test(String(fig.creditUrl))) fail(slug, 'figure.creditUrl은 https 주소여야 해요');
  if (data.figureAfterSection) {
    if (!parsed.hasSections) fail(slug, 'figureAfterSection은 소제목 구역이 있는 용어에서만 써요');
    else if (!parsed.sections.some((s) => s.heading === data.figureAfterSection && !(s as any).callout))
      fail(slug, `figureAfterSection 「${data.figureAfterSection}」에 맞는 일반 구역이 없어요`);
  }
}

const termFiles = fs.readdirSync(TERMS_DIR).filter((f) => f.endsWith('.md'));
const parsedFiles = termFiles.map((file) => matter(fs.readFileSync(path.join(TERMS_DIR, file), 'utf-8')).data);
const knownSlugs = new Set(parsedFiles.map((d) => String(d.termSlug)));

const figSizes = new Map<string, { width?: number; height?: number }>();
for (const d of parsedFiles) {
  const src = String(d.figure?.src ?? '');
  const file = path.join(PUBLIC_DIR, src);
  if (src.startsWith('/img/terms/') && fs.existsSync(file)) figSizes.set(file, await sharp(file).metadata());
}

for (const data of parsedFiles) {
  const slug = String(data.termSlug);
  const detail = String(data.detail ?? '');
  const parsed = parseDetail(detail);
  // 링크 문법을 못 그리는 칸(모든 용어): 설명·제목·FAQ·질문 카드
  const plainFields: Record<string, string> = { definition: String(data.definition ?? ''), seoTitle: String(data.seoTitle ?? '') };
  (data.faqs ?? []).forEach((f: { question?: string; answer?: string }, i: number) => {
    plainFields[`faqs[${i}].question`] = String(f.question ?? '');
    plainFields[`faqs[${i}].answer`] = String(f.answer ?? '');
  });
  (data.askCards ?? []).forEach((c: { question?: string; explanation?: string }, i: number) => {
    plainFields[`askCards[${i}].question`] = String(c.question ?? '');
    plainFields[`askCards[${i}].explanation`] = String(c.explanation ?? '');
  });
  for (const f of fieldsWithLinks(plainFields)) fail(slug, `${f}에 링크 문법 [글](주소)이 있어요(링크는 본문 구역에서만)`);
  checkFigure(slug, data, parsed);
  if (!parsed.hasSections) continue;
  sectioned.add(slug);
  for (const msg of checkSectionLinks(slug, parsed.sections, knownSlugs)) fail(slug, msg);

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
    for (const c of sec.cites) {
      if (!sourceUrls.has(c.url)) fail(slug, `「${h}」의 근거 주소가 참고 자료 목록에 없어요: ${c.url}`);
      if (isEmpathy(c.after)) fail(slug, `「${h}」: 공감·안내 문장 뒤에 각주를 뒀어요: ${c.after}`);
    }
  }

  // 새 틀 페이지는 질문 카드 3개가 기준이에요(실패 아님, 내용은 리서치가 채워요)
  const askCount = (data.askCards ?? []).length;
  if (askCount !== 3) warnings.push(`${slug}: 새 틀 페이지 askCards는 3개여야 해요(지금 ${askCount}개)`);

  // 질문 카드: 질문·설명·출처(주소와 이름)가 모두 있어야 각주로 이어져요
  for (const card of (data.askCards ?? []) as { question?: string; explanation?: string; sourceUrl?: string; sourceLabel?: string; citeAfter?: number }[]) {
    if (!card.question || !card.explanation || !card.sourceUrl || !card.sourceLabel)
      fail(slug, `질문 카드에 빠진 칸이 있어요: ${card.question ?? '(질문 없음)'}`);
    else {
      const sentences = splitSentences(card.explanation);
      const k = (card as { citeAfter?: number }).citeAfter ?? sentences.length;
      if (k < 1 || k > sentences.length) fail(slug, `질문 카드 citeAfter가 범위를 벗어났어요: ${card.question}`);
      else if (isEmpathy(sentences[k - 1])) fail(slug, `질문 카드: 공감·안내 문장 뒤에 각주를 뒀어요: ${sentences[k - 1]}`);
    }
  }

  // 근거 줄 모양이 틀려 문단으로 읽힌 경우를 잡는다
  for (const sec of parsed.sections)
    for (const p of sec.paragraphs)
      if (p.includes('[근거]')) fail(slug, `근거 줄 모양이 틀려요(소제목 「${sec.heading}」): ${p.slice(0, 40)}`);

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

// 관련 용어(relatedTerms): 자기 자신, 합쳐져 없어진 slug(남은 주소로 바꿔요)를 가리키면 안 돼요
for (const data of parsedFiles) {
  const slug = String(data.termSlug);
  for (const rel of (data.relatedTerms ?? []) as string[]) {
    if (rel === slug) fail(slug, `relatedTerms가 자기 자신을 가리켜요: ${rel}`);
    else if (mergedTerms[rel]) fail(slug, `relatedTerms가 합쳐져 없어진 ${rel}를 가리켜요(→ ${mergedTerms[rel]})`);
  }
}

if (warnings.length) {
  console.warn(`check-terms: 경고 ${warnings.length}건(실패 아님)`);
  for (const w of warnings) console.warn(`  - ${w}`);
}
if (errors.length) {
  console.error(`check-terms: ${errors.length}건 실패`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`check-terms: 통과 (소제목 용어 ${sectioned.size}개, 장부 ${Object.keys(ledger).length}개)`);
