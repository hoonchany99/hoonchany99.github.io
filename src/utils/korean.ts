const CHOSUNG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

/** 한글 음절의 초성 (첫 글자 기준) — 알파벳·숫자는 별도 그룹 */
export function getChosung(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    return CHOSUNG[Math.floor((code - 0xac00) / 588)] ?? '#';
  }
  if (/[0-9]/.test(char)) return '0-9';
  if (/[A-Za-z]/.test(char)) return 'A-Z';
  return '#';
}

export function getTermChosung(name: string): string {
  const first = name.trim()[0];
  if (!first) return '#';
  return getChosung(first);
}

/** 초성 필터용 — ㄲ→ㄱ, ㄸ→ㄷ 등 묶음 */
export function getChosungGroup(chosung: string): string {
  const map: Record<string, string> = {
    'ㄲ': 'ㄱ',
    'ㄸ': 'ㄷ',
    'ㅃ': 'ㅂ',
    'ㅆ': 'ㅅ',
    'ㅉ': 'ㅈ',
  };
  return map[chosung] ?? chosung;
}

export const CHOSUNG_BAR = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'] as const;

/** 초성 + 알파벳·숫자 필터 바 */
export const TERM_INDEX_BAR = [...CHOSUNG_BAR, 'A-Z', '0-9'] as const;

type TermNameSortGroup = 'hangul' | 'latin' | 'digit' | 'other';

const SORT_GROUP_ORDER: Record<TermNameSortGroup, number> = {
  hangul: 0,
  latin: 1,
  digit: 2,
  other: 3,
};

/** 전체 목록 정렬 그룹: 한글 → 영어 → 숫자 */
export function getTermNameSortGroup(name: string): TermNameSortGroup {
  const first = name.trim()[0];
  if (!first) return 'other';
  const code = first.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return 'hangul';
  if (/[A-Za-z]/.test(first)) return 'latin';
  if (/[0-9]/.test(first)) return 'digit';
  return 'other';
}

/** 치과사전 용어명 정렬 — ㄱㄴㄷ → A-Z → 0-9 */
export function compareTermNames(a: string, b: string): number {
  const ga = getTermNameSortGroup(a);
  const gb = getTermNameSortGroup(b);
  const groupDiff = SORT_GROUP_ORDER[ga] - SORT_GROUP_ORDER[gb];
  if (groupDiff !== 0) return groupDiff;

  if (ga === 'latin') {
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  }
  if (ga === 'digit') {
    return a.localeCompare(b, 'ko', { numeric: true });
  }
  return a.localeCompare(b, 'ko');
}
