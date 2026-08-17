import type { CanonicalTerm } from './termsRich.ts';

/**
 * 우리가 직접 추가하는 표제어.
 *
 * termsCanonical.ts는 bdbddc.com에서 긁어온 자동 생성 파일이라
 * 그쪽 목록에 없는 용어는 아무리 중요해도 들어오지 않는다.
 * 그 파일을 직접 고치면 다음 sync-bdbddc-terms 실행 때 지워지므로,
 * 여기에 두고 생성 단계에서 합친다.
 *
 * 설명·FAQ는 다른 용어와 똑같이 termsAuthored.ts에 쓴다.
 */
export const termsExtra: CanonicalTerm[] = [
  {
    slug: 'vestibuloplasty',
    name: '전정성형술',
    aliases: ['전정성형술', '구강전정성형술', '전정확장술', '입술 재위치술'],
    topicSlug: 'implant',
    definition:
      '전정성형술은 입술·볼과 잇몸 사이의 고랑을 깊게 만들어 주는 수술이에요. 틀니가 자꾸 빠지거나 잇몸이 당길 때 씁니다.',
  },
];
