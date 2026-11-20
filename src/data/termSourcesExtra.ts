import type { TermSource } from '../lib/termSections.ts';

/**
 * 본문을 termDetails.ts에 두는 용어의 참고 자료.
 * (termsAuthored.ts에 있는 용어는 그 항목의 sources를 써요. 거기 있으면 이 목록은 쓰지 않아요.)
 * 제목을 붙이면 용어 페이지에 번호 목록(제목 → 기관 주소 ↗)으로 나와요.
 */
export const termSourcesExtra: Record<string, TermSource[]> = {
  'apical-periodontitis': [
    {
      url: 'https://www.msdmanuals.com/professional/dental-disorders/common-dental-disorders/pulpitis',
      title: 'MSD 매뉴얼 전문가판: 치수염 원인(충치·외상)과 합병증',
    },
    {
      url: 'https://www.msdmanuals.com/professional/dental-disorders/symptoms-of-dental-and-oral-disorders/toothache-and-infection',
      title: 'MSD 매뉴얼 전문가판: 치통과 감염: 치근단 치주염과 농양 구별',
    },
    {
      url: 'https://www.msdmanuals.com/home/mouth-and-dental-disorders/tooth-disorders/periapical-abscess',
      title: 'MSD 매뉴얼 일반인판: 농양은 발치·근관치료, 항생제는 보조',
    },
  ],
  'extraction': [
    {
      url: 'https://www.msdmanuals.com/professional/dental-disorders/how-to-do-dental-procedures/how-to-do-an-emergency-tooth-extraction',
      title: 'MSD 매뉴얼 전문가판: 발치 대상은 살릴 수 없는 치아',
    },
    {
      url: 'https://www.nhs.uk/conditions/wisdom-tooth-removal/',
      title: '영국 국민보건서비스(NHS): 국소마취 뒤 발치, 흡연·음주 피하기, 심해지는 통증',
    },
    {
      url: 'https://www.mcgill.ca/omfs/patient-info/teeth-extractions',
      title: '맥길대학교 구강악안면외과: 첫 24시간 주의사항, 연락이 필요한 감염 신호',
    },
  ],
  'occlusal-adjustment': [
    {
      url: 'https://europepmc.org/article/MED/39282765',
      title: '코크란(2024): 턱관절 장애에 교합 치료 효과는 근거 부족(초록)',
    },
  ],
};
