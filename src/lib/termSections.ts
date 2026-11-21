/**
 * 용어 본문(detail)을 소제목 구역으로 나누는 도우미.
 *
 * detail 문자열 형식 (소제목이 하나도 없으면 지금처럼 한 덩어리 본문이에요)
 *
 *   ## 소제목                         ← 줄 맨 앞 「## 」가 구역 시작. 첫 줄은 반드시 소제목
 *   ## !소제목                        ← 「!」를 붙이면 주황 안내 상자(「이럴 땐 미루지 마세요」 자리)로 그려요
 *   문장 문장 문장.                   ← 빈 줄로 문단을 나눠요
 *
 * 각주(근거) 표시: 출처가 받쳐 주는 문장 바로 뒤에 같은 줄에서 이렇게 써요.
 *
 *   발치 후 첫날은 혈병이 자리 잡는 중요한 시기예요. [근거](https://… "기관: 내용") 다음 문장…
 *
 * 화면에서는 이 표시가 문장 끝 작은 위첨자 번호가 되고, 맨 아래 「참고 자료」 N번으로 이어져요.
 * 번호는 템플릿이 처음 나온 순서대로 매기고, 같은 주소는 같은 번호를 써요.
 * - 출처가 문장 여러 개를 받치면 그 가운데 마지막 사실 문장 뒤에 두어요.
 * - 공감·안내 문장(「많이 긴장되실 수 있어요」 같은) 뒤에는 두지 않아요(check-terms가 잡아요).
 * - 표시만 따로 한 줄에 쓰면(예전 방식) 그 문단 맨 끝에 붙어요.
 *
 * 문장 안 내부 링크: 다른 용어 페이지로 가는 링크는 보이는 글에 그대로 써요.
 *
 *   발치 후에는 [드라이 소켓](/terms/dry-socket/)을 조심해야 해요.
 *
 * 내부 주소 「/terms/<slug>/」만 링크로 그려요(안내 상자 「!」 구역에는 쓰지 않아요). 외부 주소는 본문에 못 쓰고 각주로만 써요.
 * 규칙은 check-terms가 잡아요(없는 slug, 자기 자신, 구역당 3개 초과, 외부 주소).
 */

export interface TermSectionSource {
  url: string;
  label: string;
}

/** 문장 바로 뒤에 붙는 각주 표시 */
export interface TermCite extends TermSectionSource {
  /** 이 각주 바로 앞 문장 */
  after: string;
}

/** 글 조각 안의 한 토막: href가 있으면 내부 링크 */
export interface TermSeg {
  text: string;
  href?: string;
}

/** 문단 조각: 글 하나와, 그 글 바로 뒤에 붙는 각주(있으면). text는 링크 문법을 벗긴 글이에요 */
export interface TermPiece {
  text: string;
  /** text를 링크 단위로 나눈 것 (링크가 없으면 한 토막) */
  segs: TermSeg[];
  cite?: TermCite;
}

/** 본문에 쓴 일반 링크 `[글](주소)` 하나 */
export interface TermLink {
  text: string;
  href: string;
}

export interface TermSection {
  heading: string;
  /** 소제목 앞에 「!」가 있으면 true: 주황 안내 상자로 보여 줘요 */
  callout: boolean;
  /** 각주 표시를 뺀 문단 글 */
  paragraphs: string[];
  /** 문단마다 글 조각과 각주 */
  pieces: TermPiece[][];
  /** 이 구역의 모든 각주 (화면에 나오는 차례) */
  cites: TermCite[];
  /** 이 구역에 쓴 일반 링크 (check-terms가 검사해요) */
  links: TermLink[];
}

export interface ParsedDetail {
  /** 줄 맨 앞 「## 」 소제목이 하나라도 있으면 true */
  hasSections: boolean;
  /** 첫 소제목 앞에 있는 글 (있으면 안 되는 글이라 검사 스크립트가 잡아요) */
  preamble: string;
  sections: TermSection[];
}

const HEADING = /^##\s+(.+?)\s*$/;
const SOURCE_LINE = /^\[근거\]\((\S+)\s+"([^"]+)"\)\s*$/;
const INLINE_CITE = /\s*\[근거\]\((\S+)\s+"([^"]+)"\)/g;

const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
/** 내부 용어 링크 주소: /terms/<slug>/ */
export const TERM_HREF = /^\/terms\/([a-z0-9][a-z0-9-]*)\/$/;

/** 글 한 토막에서 `[글](주소)`를 찾아 벗긴 글과 토막 목록으로 나눈다. 내부 용어 주소만 href를 달아요 */
function splitLinks(chunk: string): TermSeg[] {
  const segs: TermSeg[] = [];
  let last = 0;
  for (const m of chunk.matchAll(INLINE_LINK)) {
    if (m.index > last) segs.push({ text: chunk.slice(last, m.index) });
    segs.push(TERM_HREF.test(m[2]) ? { text: m[1], href: m[2] } : { text: m[1] });
    last = m.index + m[0].length;
  }
  if (last < chunk.length) segs.push({ text: chunk.slice(last) });
  return segs;
}

/** 링크 문법을 벗겨 글만 남긴다 (설명 칸·JSON-LD처럼 링크를 못 그리는 곳용) */
export function stripLinks(text: string): string {
  return text.replace(INLINE_LINK, '$1');
}

/** 글에 들어 있는 일반 링크 목록 */
export function findLinks(text: string): TermLink[] {
  return [...text.matchAll(INLINE_LINK)].map((m) => ({ text: m[1], href: m[2] }));
}

function makePiece(chunk: string, cite?: TermCite): TermPiece {
  const segs = splitLinks(chunk);
  return { text: segs.map((g) => g.text).join(''), segs, ...(cite ? { cite } : {}) };
}

/** 문단 하나를 글 조각과 각주로 나눈다 */
function splitPieces(text: string): TermPiece[] {
  const pieces: TermPiece[] = [];
  let acc = '';
  let last = 0;
  for (const m of text.matchAll(INLINE_CITE)) {
    const piece = makePiece(text.slice(last, m.index));
    acc += piece.text;
    const sentence = splitSentences(acc).at(-1) ?? acc;
    pieces.push({ ...piece, cite: { url: m[1], label: m[2], after: sentence } });
    last = (m.index ?? 0) + m[0].length;
  }
  const rest = text.slice(last);
  if (rest || pieces.length === 0) pieces.push(makePiece(rest));
  return pieces;
}

export function parseDetail(detail: string): ParsedDetail {
  const lines = detail.split('\n');
  const sections: TermSection[] = [];
  const preambleLines: string[] = [];
  let current: TermSection | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length === 0) return;
    const text = buffer.join(' ').trim();
    buffer = [];
    if (!text) return;
    if (!current) {
      preambleLines.push(text);
      return;
    }
    const pieces = splitPieces(text);
    current.pieces.push(pieces);
    current.paragraphs.push(pieces.map((p) => p.text).join(''));
    for (const p of pieces) if (p.cite) current.cites.push(p.cite);
    current.links.push(...findLinks(text.replace(INLINE_CITE, '')));
  };

  for (const raw of lines) {
    const line = raw.trim();
    const heading = line.match(HEADING);
    if (heading) {
      flush();
      const callout = heading[1].startsWith('!');
      current = { heading: callout ? heading[1].slice(1).trim() : heading[1], callout, paragraphs: [], pieces: [], cites: [], links: [] };
      sections.push(current);
      continue;
    }
    const source = line.match(SOURCE_LINE);
    if (source && current && buffer.length === 0 && current.pieces.length > 0) {
      // 예전 방식: 표시만 한 줄 → 바로 앞 문단 맨 끝에 붙인다
      const last = current.pieces[current.pieces.length - 1];
      const sentence = splitSentences(current.paragraphs[current.paragraphs.length - 1]).at(-1) ?? '';
      const cite = { url: source[1], label: source[2], after: sentence };
      last[last.length - 1].cite = cite;
      current.cites.push(cite);
      continue;
    }
    if (line === '') {
      flush();
      continue;
    }
    buffer.push(line);
  }
  flush();

  return {
    hasSections: sections.length > 0,
    preamble: preambleLines.join('\n\n'),
    sections,
  };
}

/** 참고 자료: 예전 글자 주소 그대로도 되고, 제목을 붙인 {url, title}도 돼요 */
export type TermSource = string | { url: string; title: string };

export function sourceUrl(s: TermSource): string {
  return typeof s === 'string' ? s : s.url;
}

export function sourceTitle(s: TermSource): string | undefined {
  return typeof s === 'string' ? undefined : s.title;
}

export function sourceHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '');
}

/** 문단 하나를 문장 목록으로 나눈다 (안내 상자의 글머리표용). 마침표·물음표·느낌표 뒤 공백에서 나눠요 */
export function splitSentences(paragraph: string): string[] {
  return paragraph
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 용어 하나에 붙는 「헷갈리는 말과 차이」 표 (내용이 있을 때만 그려요) */
export interface TermCompare {
  title: string;
  columns: string[];
  rows: { label: string; cells: string[] }[];
}

/** 「진료실에서 물어볼 것」 질문 카드 (내용이 있을 때만 그려요) */
export interface TermAskCard {
  question: string;
  explanation: string;
  sourceLabel: string;
  sourceUrl: string;
  /** 각주 번호를 둘 문장 번호(1부터). 없으면 설명의 마지막 문장 */
  citeAfter?: number;
}

/**
 * 안내 상자 글머리표용: 문단 조각을 문장으로 나누고, 각주를 그 앞 문장에 붙인다.
 * (각주는 글 속 위치가 그 문장 끝 이전이면 그 문장에 붙어요)
 */
export function sentenceBullets(pieces: TermPiece[]): { sentence: string; cites: TermCite[] }[] {
  const clean = pieces.map((p) => p.text).join('');
  const sentences = splitSentences(clean);
  const ends: number[] = [];
  let cursor = 0;
  for (const s of sentences) {
    const i = clean.indexOf(s, cursor);
    cursor = i + s.length;
    ends.push(cursor);
  }
  const out = sentences.map((sentence) => ({ sentence, cites: [] as TermCite[] }));
  let offset = 0;
  for (const p of pieces) {
    offset += p.text.length;
    if (!p.cite) continue;
    let idx = ends.findIndex((e) => e >= offset);
    if (idx < 0) idx = out.length - 1;
    out[idx].cites.push(p.cite);
  }
  return out;
}

/** 공감·안내 문장 뒤에는 각주를 두지 않는다 (check-terms가 쓰는 짧은 목록) */
export const EMPATHY_PHRASES = ['많이 걱정되셨죠', '긴장되실 수', '자주 듣는', '불안하실 수', '많이 놀라', '놀라셨죠'];
export const isEmpathy = (sentence: string) => EMPATHY_PHRASES.some((p) => sentence.includes(p));
