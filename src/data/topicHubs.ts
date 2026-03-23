export interface TopicHub {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tagKeywords: string[];
  guideFaq: string[];
  guideAudience: string;
}

const svgOpen = 'xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 240 160"';
const gAttrs = 'stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';

export const topicIcons: Record<string, string> = {
  cavity: `<svg ${svgOpen} aria-label="충치·신경치료"><g ${gAttrs}><path d="M76 42C63 42 54 51 54 64C54 76 60 83 66 91C71 98 74 106 76 116C78 127 83 134 92 134C99 134 104 129 104 120V105C104 98 108 94 114 94H126C132 94 136 98 136 105V120C136 129 141 134 148 134C157 134 162 127 164 116C166 106 169 98 174 91C180 83 186 76 186 64C186 51 177 42 164 42C153 42 146 48 140 55C135 61 129 64 120 64C111 64 105 61 100 55C94 48 87 42 76 42Z"/><path d="M124 108V124"/><path d="M116 116H132"/><path d="M83 74C86 68 92 64 99 64C106 64 111 68 114 74"/><circle cx="92" cy="82" r="6"/></g></svg>`,
  implant: `<svg ${svgOpen} aria-label="임플란트"><g ${gAttrs}><path d="M74 38C61 38 52 47 52 60C52 72 58 79 64 87C69 94 72 102 74 112C76 123 81 130 90 130C97 130 102 125 102 116V102C102 94 108 88 116 88H124C132 88 138 94 138 102V116C138 125 143 130 150 130C159 130 164 123 166 112C168 102 171 94 176 87C182 79 188 72 188 60C188 47 179 38 166 38C155 38 148 44 142 51C137 57 131 60 120 60C109 60 103 57 98 51C92 44 85 38 74 38Z"/><path d="M120 76V118"/><path d="M108 88H132"/><path d="M111 100H129"/><path d="M113 112H127"/><path d="M104 54L112 46"/><path d="M136 46L128 54"/></g></svg>`,
  'crown-inlay': `<svg ${svgOpen} aria-label="크라운·인레이"><g ${gAttrs}><path d="M76 40C63 40 54 49 54 62C54 74 60 81 66 89C71 96 74 104 76 114C78 125 83 132 92 132C99 132 104 127 104 118V104C104 97 108 92 114 92H126C132 92 136 97 136 104V118C136 127 141 132 148 132C157 132 162 125 164 114C166 104 169 96 174 89C180 81 186 74 186 62C186 49 177 40 164 40C153 40 146 46 140 53C135 59 129 62 120 62C111 62 105 59 100 53C94 46 87 40 76 40Z"/><path d="M96 72L108 66H132L144 72V94L132 100H108L96 94V72Z"/><path d="M108 66V100"/><path d="M132 66V100"/><path d="M96 72L108 78H132L144 72"/></g></svg>`,
  'wisdom-tooth': `<svg ${svgOpen} aria-label="사랑니·발치"><g ${gAttrs}><path d="M76 42C63 42 54 51 54 64C54 76 60 83 66 91C71 98 74 106 76 116C78 127 83 134 92 134C99 134 104 129 104 120V106C104 98 108 94 114 94H126C132 94 136 98 136 106V120C136 129 141 134 148 134C157 134 162 127 164 116C166 106 169 98 174 91C180 83 186 76 186 64C186 51 177 42 164 42C153 42 146 48 140 55C135 61 129 64 120 64C111 64 105 61 100 55C94 48 87 42 76 42Z"/><path d="M150 78L182 110"/><path d="M182 78L150 110"/><path d="M86 78C92 72 102 72 108 78"/></g></svg>`,
  'laminate-whitening': `<svg ${svgOpen} aria-label="라미네이트·미백"><g ${gAttrs}><path d="M76 42C63 42 54 51 54 64C54 76 60 83 66 91C71 98 74 106 76 116C78 127 83 134 92 134C99 134 104 129 104 120V105C104 98 108 94 114 94H126C132 94 136 98 136 105V120C136 129 141 134 148 134C157 134 162 127 164 116C166 106 169 98 174 91C180 83 186 76 186 64C186 51 177 42 164 42C153 42 146 48 140 55C135 61 129 64 120 64C111 64 105 61 100 55C94 48 87 42 76 42Z"/><path d="M120 30L124 42L136 46L124 50L120 62L116 50L104 46L116 42L120 30Z"/><path d="M160 44L163 52L171 55L163 58L160 66L157 58L149 55L157 52L160 44Z"/><path d="M94 48L97 56L105 59L97 62L94 70L91 62L83 59L91 56L94 48Z"/></g></svg>`,
  'gum-prevention': `<svg ${svgOpen} aria-label="잇몸·스케일링·예방"><g ${gAttrs}><path d="M76 42C63 42 54 51 54 64C54 76 60 83 66 91C71 98 74 106 76 116C78 127 83 134 92 134C99 134 104 129 104 120V105C104 98 108 94 114 94H126C132 94 136 98 136 105V120C136 129 141 134 148 134C157 134 162 127 164 116C166 106 169 98 174 91C180 83 186 76 186 64C186 51 177 42 164 42C153 42 146 48 140 55C135 61 129 64 120 64C111 64 105 61 100 55C94 48 87 42 76 42Z"/><path d="M178 42L152 68"/><path d="M166 40L180 54"/><path d="M146 74L158 86"/><path d="M84 72C90 69 97 68 104 68H136C143 68 150 69 156 72"/><path d="M90 84H150"/></g></svg>`,
};

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
