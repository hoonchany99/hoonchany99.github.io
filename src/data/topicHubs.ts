export interface TopicHub {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tagKeywords: string[];
  guideFaq: string[];
  guideAudience: string;
}

export const topicHubs: TopicHub[] = [
  {
    slug: 'cavity',
    name: '충치 · 신경치료',
    description: '충치 진행 단계부터 신경치료 과정까지, 치아 통증의 원인과 치료법',
    icon: '🦷',
    tagKeywords: ['충치', '신경치료', '치수염', '근관', '법랑질', '상아질', '레진', '2차충치', '치근단'],
    guideFaq: [
      '충치가 얼마나 진행됐는지 어떻게 아나요?',
      '신경치료는 몇 번이나 와야 하나요?',
      '충치인데 안 아프면 치료 안 해도 되나요?',
    ],
    guideAudience: '찬물에 시리거나, 씹을 때 통증이 있거나, 충치 치료를 앞두고 걱정되는 분',
  },
  {
    slug: 'implant',
    name: '임플란트',
    description: '수술 과정, 비용, 통증, 부작용까지 임플란트의 모든 것',
    icon: '🔩',
    tagKeywords: ['임플란트', '뼈이식', '상악동', '골유착', '픽스쳐', '어버트먼트', '임플란트주위염'],
    guideFaq: [
      '임플란트 수명은 얼마나 되나요?',
      '뼈이식은 꼭 해야 하나요?',
      '임플란트 수술 후 통증은 얼마나 가나요?',
    ],
    guideAudience: '임플란트를 처음 고려하거나, 수술 전후로 궁금한 점이 많은 분',
  },
  {
    slug: 'crown-inlay',
    name: '크라운 · 인레이',
    description: '재료 선택부터 수명 관리까지, 보철 치료 완벽 가이드',
    icon: '👑',
    tagKeywords: ['크라운', '인레이', '온레이', '세렉', '보철', '골드크라운', '지르코니아', '세라믹'],
    guideFaq: [
      '금, 세라믹, 지르코니아 중 뭘 선택해야 하나요?',
      '크라운은 보통 얼마나 오래 쓸 수 있나요?',
      '인레이 치료 후 시린 건 정상인가요?',
    ],
    guideAudience: '충치 치료 후 보철물 선택을 고민하거나, 기존 크라운/인레이에 문제가 생긴 분',
  },
  {
    slug: 'wisdom-tooth',
    name: '사랑니 · 발치',
    description: '꼭 빼야 할까? 발치 기준부터 회복까지 총정리',
    icon: '🪥',
    tagKeywords: ['사랑니', '발치', '매복', '건조와', '수평사랑니', '치관주위염'],
    guideFaq: [
      '사랑니는 무조건 뽑아야 하나요?',
      '매복 사랑니 발치는 많이 아픈가요?',
      '발치 후 회복 기간은 보통 얼마나 걸리나요?',
    ],
    guideAudience: '사랑니가 아프거나, 발치를 권유받고 걱정되는 분',
  },
  {
    slug: 'laminate-whitening',
    name: '라미네이트 · 미백',
    description: '더 예쁜 치아를 위한 심미 치료, 현실적인 기대와 관리법',
    icon: '✨',
    tagKeywords: ['라미네이트', '미백', '미니쉬', '제로네이트', '치아미백', '과산화수소', '앞니'],
    guideFaq: [
      '라미네이트 하면 치아를 많이 깎나요?',
      '미백 후 시린 건 정상인가요?',
      '라미네이트 수명은 보통 얼마나 되나요?',
    ],
    guideAudience: '앞니 심미 치료를 고려하거나, 미백 효과와 부작용이 궁금한 분',
  },
  {
    slug: 'gum-prevention',
    name: '잇몸 · 스케일링 · 예방',
    description: '치석 제거, 잇몸 관리, 올바른 양치법으로 치아 건강 지키기',
    icon: '🛡️',
    tagKeywords: ['스케일링', '잇몸', '치주', '치은', '불소', '양치', '치약', '치석', '바스법', '실란트'],
    guideFaq: [
      '스케일링은 왜 정기적으로 해야 하나요?',
      '잇몸에서 피가 나면 치주염인가요?',
      '불소 치약과 무불소 치약, 뭘 써야 하나요?',
    ],
    guideAudience: '잇몸이 붓거나 피가 나는 분, 올바른 양치법과 예방 관리가 궁금한 분',
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
