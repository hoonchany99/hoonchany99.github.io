/**
 * 용어 본문(detail)을 소제목 구역으로 나누는 도우미.
 *
 * detail 문자열 형식 (소제목이 하나도 없으면 지금처럼 한 덩어리 본문이에요)
 *
 *   ## 소제목                         ← 줄 맨 앞 「## 」가 구역 시작. 첫 줄은 반드시 소제목
 *   문장 문장 문장.                   ← 빈 줄로 문단을 나눠요
 *
 *   [근거](https://… "기관: 내용")    ← 구역 끝에 한 줄. 화면에 「근거: 기관: 내용 →」로 나와요
 *
 * 근거 줄은 구역마다 최대 하나이고, 줄 전체가 이 모양일 때만 근거로 읽어요.
 */

export interface TermSectionSource {
  url: string;
  label: string;
}

export interface TermSection {
  heading: string;
  paragraphs: string[];
  source?: TermSectionSource;
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
    if (current) current.paragraphs.push(text);
    else preambleLines.push(text);
  };

  for (const raw of lines) {
    const line = raw.trim();
    const heading = line.match(HEADING);
    if (heading) {
      flush();
      current = { heading: heading[1], paragraphs: [] };
      sections.push(current);
      continue;
    }
    const source = line.match(SOURCE_LINE);
    if (source && current) {
      flush();
      current.source = { url: source[1], label: source[2] };
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
