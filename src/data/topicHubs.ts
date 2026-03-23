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
      '찬물 마실 때 찌릿한데, 이게 충치인가요?',
      '신경치료 3번째인데 왜 아직 안 끝나나요?',
      '안 아픈 충치도 꼭 치료해야 하나요?',
    ],
    guideAudience: '찬물에 시리거나 씹을 때 통증이 있어서, 충치인지 신경 문제인지 헷갈리는 분',
  },
  {
    slug: 'implant',
    name: '임플란트',
    description: '수술 과정, 비용, 통증, 부작용까지 임플란트의 모든 것',
    icon: '🔩',
    tagKeywords: ['임플란트', '뼈이식', '상악동', '골유착', '픽스쳐', '어버트먼트', '임플란트주위염'],
    guideFaq: [
      '임플란트 했는데 10년 뒤에도 괜찮을까요?',
      '뼈가 부족하다는데, 뼈이식 안 하면 안 되나요?',
      '수술 다음 날 출근해도 되나요?',
    ],
    guideAudience: '임플란트를 처음 권유받았거나, 수술 전후 통증·비용·부작용이 걱정되는 분',
  },
  {
    slug: 'crown-inlay',
    name: '크라운 · 인레이',
    description: '재료 선택부터 수명 관리까지, 보철 치료 완벽 가이드',
    icon: '👑',
    tagKeywords: ['크라운', '인레이', '온레이', '세렉', '보철', '골드크라운', '지르코니아', '세라믹'],
    guideFaq: [
      '금이 좋다는데, 앞니도 금으로 해야 하나요?',
      '크라운 씌운 지 5년인데, 언제 바꿔야 하나요?',
      '인레이 한 뒤로 찬물에 시린데 괜찮은 건가요?',
    ],
    guideAudience: '충치 치료 후 재료 선택이 고민되거나, 씌운 보철물에 문제가 생긴 분',
  },
  {
    slug: 'wisdom-tooth',
    name: '사랑니 · 발치',
    description: '꼭 빼야 할까? 발치 기준부터 회복까지 총정리',
    icon: '🪥',
    tagKeywords: ['사랑니', '발치', '매복', '건조와', '수평사랑니', '치관주위염'],
    guideFaq: [
      '안 아픈 사랑니도 뽑으라는데, 진짜 빼야 하나요?',
      '매복이라 뼈를 깎아야 한다는데 많이 아픈가요?',
      '발치하고 며칠 쉬어야 하나요? 밥은 언제부터 먹나요?',
    ],
    guideAudience: '사랑니가 욱신거리거나, 발치를 권유받고 수술이 무서운 분',
  },
  {
    slug: 'laminate-whitening',
    name: '라미네이트 · 미백',
    description: '더 예쁜 치아를 위한 심미 치료, 현실적인 기대와 관리법',
    icon: '✨',
    tagKeywords: ['라미네이트', '미백', '미니쉬', '제로네이트', '치아미백', '과산화수소', '앞니'],
    guideFaq: [
      '라미네이트 하면 내 치아를 얼마나 깎는 건가요?',
      '미백했는데 너무 시려요, 이게 정상인가요?',
      '라미네이트가 깨지면 어떻게 되나요? 다시 해야 하나요?',
    ],
    guideAudience: '앞니가 마음에 안 들거나, 미백·라미네이트 후 부작용이 걱정되는 분',
  },
  {
    slug: 'gum-prevention',
    name: '잇몸 · 스케일링 · 예방',
    description: '치석 제거, 잇몸 관리, 올바른 양치법으로 치아 건강 지키기',
    icon: '🛡️',
    tagKeywords: ['스케일링', '잇몸', '치주', '치은', '불소', '양치', '치약', '치석', '바스법', '실란트'],
    guideFaq: [
      '양치할 때 피가 나는데, 세게 닦아서 그런 건가요?',
      '스케일링 받으면 이가 시려지던데 괜찮은 건가요?',
      '불소 치약이 좋다는데, 무불소 쓰면 안 되나요?',
    ],
    guideAudience: '잇몸에서 피가 나거나, 양치법·치약 선택이 헷갈리는 분',
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
