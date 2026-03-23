export interface TopicHub {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tagKeywords: string[];
}

export const topicHubs: TopicHub[] = [
  {
    slug: 'cavity',
    name: '충치 · 신경치료',
    description: '충치 진행 단계부터 신경치료 과정까지, 치아 통증의 원인과 치료법',
    icon: '🦷',
    tagKeywords: ['충치', '신경치료', '치수염', '근관', '법랑질', '상아질', '레진', '2차충치', '치근단'],
  },
  {
    slug: 'implant',
    name: '임플란트',
    description: '수술 과정, 비용, 통증, 부작용까지 임플란트의 모든 것',
    icon: '🔩',
    tagKeywords: ['임플란트', '뼈이식', '상악동', '골유착', '픽스쳐', '어버트먼트', '임플란트주위염'],
  },
  {
    slug: 'crown-inlay',
    name: '크라운 · 인레이',
    description: '재료 선택부터 수명 관리까지, 보철 치료 완벽 가이드',
    icon: '👑',
    tagKeywords: ['크라운', '인레이', '온레이', '세렉', '보철', '골드크라운', '지르코니아', '세라믹'],
  },
  {
    slug: 'wisdom-tooth',
    name: '사랑니 · 발치',
    description: '꼭 빼야 할까? 발치 기준부터 회복까지 총정리',
    icon: '🪥',
    tagKeywords: ['사랑니', '발치', '매복', '건조와', '수평사랑니', '치관주위염'],
  },
  {
    slug: 'laminate-whitening',
    name: '라미네이트 · 미백',
    description: '더 예쁜 치아를 위한 심미 치료, 현실적인 기대와 관리법',
    icon: '✨',
    tagKeywords: ['라미네이트', '미백', '미니쉬', '제로네이트', '치아미백', '과산화수소', '앞니'],
  },
  {
    slug: 'gum-prevention',
    name: '잇몸 · 스케일링 · 예방',
    description: '치석 제거, 잇몸 관리, 올바른 양치법으로 치아 건강 지키기',
    icon: '🛡️',
    tagKeywords: ['스케일링', '잇몸', '치주', '치은', '불소', '양치', '치약', '치석', '바스법', '실란트'],
  },
];

export function findTopicHub(tags: string[]): TopicHub | null {
  if (!tags || tags.length === 0) return null;

  let bestHub: TopicHub | null = null;
  let bestScore = 0;

  for (const hub of topicHubs) {
    let score = 0;
    for (const tag of tags) {
      const normalizedTag = tag.toLowerCase();
      for (const keyword of hub.tagKeywords) {
        if (normalizedTag.includes(keyword) || keyword.includes(normalizedTag)) {
          score++;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestHub = hub;
    }
  }

  return bestScore > 0 ? bestHub : null;
}
