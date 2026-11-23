/**
 * 주제별 치료 가이드 본문(src/content/topicGuides/*.md)을 읽는 도우미.
 * 「## 소제목」(「## !」는 주황 안내 상자)과 [근거] 각주·내부 용어 링크는 용어 본문과 같고(termSections.splitPieces 재사용),
 * 용어 본문에 없는 네 가지 블록만 더 읽어요.
 *
 *   | 표 | 머리줄 | ...        ← 줄 맨 앞 「|」: 첫 줄이 머리, 둘째 줄(---)은 건너뜀. 칸 안에 [근거]·링크 가능
 *   - [ ] 물어볼 질문              ← 체크리스트(누르는 칸이 아니라 읽는 목록)
 *   **Q. 질문**\n답               ← 자주 묻는 질문 (답 줄은 바로 다음 줄부터 문단 끝까지)
 *   **1. 단계 이름**\n설명         ← 치료 단계
 *   그 밖의 문단                   ← 일반 문단
 */
import { splitPieces } from './termSections.ts';
import type { TermPiece } from './termSections.ts';

export type GuideBlock =
  | { kind: 'para'; pieces: TermPiece[] }
  | { kind: 'table'; header: string[]; rows: TermPiece[][][] }
  | { kind: 'checklist'; items: TermPiece[][] }
  | { kind: 'step'; title: string; pieces: TermPiece[] }
  | { kind: 'qa'; question: string; pieces: TermPiece[] };

export interface GuideSection {
  heading: string;
  callout: boolean;
  blocks: GuideBlock[];
}

const HEADING = /^##\s+(.+?)\s*$/;
const bold = (s: string) => s.replace(/^\*\*|\*\*$/g, '').trim();

function parseChunk(lines: string[]): GuideBlock {
  const first = lines[0];
  if (first.startsWith('|')) {
    const cells = (l: string) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    const [head, , ...rest] = lines;
    return { kind: 'table', header: cells(head), rows: rest.map((l) => cells(l).map((c) => splitPieces(c))) };
  }
  if (lines.every((l) => l.startsWith('- [ ] '))) {
    return { kind: 'checklist', items: lines.map((l) => splitPieces(l.slice(6))) };
  }
  const qa = first.match(/^\*\*(Q\..+?)\*\*$/);
  if (qa) return { kind: 'qa', question: qa[1].replace(/^Q\.\s*/, ''), pieces: splitPieces(lines.slice(1).join(' ')) };
  const step = first.match(/^\*\*(\d+\..+?)\*\*$/);
  if (step) return { kind: 'step', title: step[1], pieces: splitPieces(lines.slice(1).join(' ')) };
  return { kind: 'para', pieces: splitPieces(lines.join(' ')) };
}

export function parseGuide(body: string): GuideSection[] {
  const sections: GuideSection[] = [];
  let chunk: string[] = [];
  const flush = () => {
    if (chunk.length && sections.length) sections[sections.length - 1].blocks.push(parseChunk(chunk));
    chunk = [];
  };
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    const h = line.match(HEADING);
    if (h) {
      flush();
      const callout = h[1].startsWith('!');
      sections.push({ heading: callout ? h[1].slice(1).trim() : h[1], callout, blocks: [] });
    } else if (line === '') flush();
    else chunk.push(line);
  }
  flush();
  return sections;
}

const plain = (pieces: TermPiece[]) => pieces.map((p) => p.text).join('').trim();

/** 화면 FAQ와 1:1인 FAQPage JSON-LD용 질문·답 (각주·링크 표시는 뺀 글) */
export function guideFaqs(sections: GuideSection[]): { question: string; answer: string }[] {
  return sections.flatMap((s) =>
    s.blocks.flatMap((b) => (b.kind === 'qa' ? [{ question: bold(b.question), answer: plain(b.pieces) }] : []))
  );
}
