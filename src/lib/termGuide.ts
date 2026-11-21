/**
 * 용어 페이지 가이드 구역(askCards)의 라벨·제목 규칙.
 * 분야(category) → 종류 표는 이 파일 한 곳에서만 정해요. 표에 없는 분야는 「그 밖」이에요.
 * 의료법 56조: 병원 이름·「우리 병원 기준」·상담 신청 문구는 여기에 넣지 않아요.
 */
export type GuideKind = 'treatment' | 'condition' | 'concept';

/** 분야 → 종류. termCategories.ts·termGuideBlocks 분야 값 그대로 */
export const GUIDE_KIND_BY_CATEGORY: Readonly<Record<string, GuideKind>> = {
  '보철·심미': 'treatment',
  '임플란트': 'treatment',
  '교정·교합': 'treatment',
  '발치·수술': 'treatment',
  '충치·신경': 'treatment', // 보존·신경치료
  '잇몸': 'condition',
  '입안 증상·질환': 'condition',
  '턱관절·이갈이': 'condition',
  '검사·재료': 'concept',
  '치아 구조': 'concept',
  '전신 건강·특수 환자': 'concept',
};

/** 분야로는 어색한 용어만 slug로 바로잡는 예외 표. 분야 표보다 먼저 봐요. 시험이 slug가 실제 있는지 확인해요 */
export const GUIDE_KIND_BY_SLUG: Readonly<Record<string, GuideKind>> = {
  // 합병증·상태·증상 → 「상담 전」
  'dry-socket': 'condition',
  'balchi-hu-tongjeung': 'condition',
  'balchi-hu-chulhyeol': 'condition',
  'malocclusion': 'condition',
  'impacted-tooth': 'condition',
  'halitosis': 'condition',
  'calculus': 'condition',
  'sangagdong-geosangsul-habbyeongjeung': 'condition',
  // 잇몸 분야지만 치료 → 「선택 전」
  'gum-graft': 'treatment',
  'scaling-root-planing': 'treatment',
  'scaling': 'treatment',
  // 안내 글 → 「진료에서 확인할 것」
  'balchi-hu-juuisahang': 'concept',
};

export const guideKind = (category: string | undefined | null, slug?: string | null): GuideKind =>
  (slug && GUIDE_KIND_BY_SLUG[slug]) || (category && GUIDE_KIND_BY_CATEGORY[category]) || 'concept';

export const isTreatmentCategory = (category: string | undefined | null): boolean => guideKind(category) === 'treatment';

export const GUIDE_TITLE_MAX = 20;

const LABEL: Record<GuideKind, string> = { treatment: '치료 선택 가이드', condition: '진료 가이드', concept: '이해 가이드' };

export const guideLabel = (category: string | undefined | null, slug?: string | null): string => LABEL[guideKind(category, slug)];

/** name은 화면 이름(officialName 붙은 제목 말고 짧은 이름). 20자를 넘으면 「{name}, 확인할 것」 */
export function guideTitle(name: string, category: string | undefined | null, slug?: string | null): string {
  const kind = guideKind(category, slug);
  const full =
    kind === 'treatment' ? `${name} 선택 전 확인할 것`
    : kind === 'condition' ? `${name} 상담 전 확인할 것`
    : `${name}, 진료에서 확인할 것`;
  return full.length > GUIDE_TITLE_MAX ? `${name}, 확인할 것` : full;
}
