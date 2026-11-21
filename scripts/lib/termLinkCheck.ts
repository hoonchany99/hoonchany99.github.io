import { TERM_HREF, findLinks } from '../../src/lib/termSections.ts';
import type { TermSection } from '../../src/lib/termSections.ts';

/** 구역 하나에 넣을 수 있는 내부 링크 수 */
export const MAX_LINKS_PER_SECTION = 3;

/**
 * 본문 구역의 일반 링크 `[글](/terms/<slug>/)` 검사. 문제마다 한 줄 메시지를 돌려줘요.
 * - 주소는 내부 용어 주소(/terms/<slug>/)만 (외부 주소는 본문에 못 쓰고 각주로만)
 * - slug가 실제 용어 페이지에 있다, 자기 자신이 아니다
 * - 구역 하나에 3개를 넘지 않는다, 안내 상자(「!」) 구역에는 쓰지 않는다
 */
export function checkSectionLinks(slug: string, sections: TermSection[], knownSlugs: Set<string>): string[] {
  const out: string[] = [];
  for (const sec of sections) {
    const h = sec.heading;
    if (sec.links.length > MAX_LINKS_PER_SECTION)
      out.push(`「${h}」: 내부 링크가 ${sec.links.length}개예요(구역당 ${MAX_LINKS_PER_SECTION}개 이하)`);
    if (sec.callout && sec.links.length > 0) out.push(`「${h}」: 안내 상자 구역에는 링크를 쓰지 않아요`);
    for (const l of sec.links) {
      const m = l.href.match(TERM_HREF);
      if (!m) out.push(`「${h}」: 본문 링크는 /terms/<slug>/ 내부 주소만 돼요(외부 주소는 각주로): [${l.text}](${l.href})`);
      else if (m[1] === slug) out.push(`「${h}」: 자기 자신으로 가는 링크예요: ${l.href}`);
      else if (!knownSlugs.has(m[1])) out.push(`「${h}」: 없는 용어 페이지로 가는 링크예요: ${l.href}`);
    }
  }
  return out;
}

/** 설명 칸·제목·FAQ처럼 링크를 못 그리는 글에 링크 문법이 들어 있으면 그 이름을 돌려줘요 */
export function fieldsWithLinks(fields: Record<string, string>): string[] {
  return Object.entries(fields)
    .filter(([, v]) => findLinks(v).length > 0)
    .map(([k]) => k);
}
