/**
 * 치과사전에 싣지 않기로 한 용어.
 *
 * 원본 용어 목록에는 사전 항목이라기보다 병원 안내문이나 홍보 문구에
 * 가까운 것들이 섞여 있다. 이런 항목은 작성하지 않는다.
 *
 * 여기 있는 슬러그는 페이지를 만들지 않으며, 남은 작업량 집계에서도 빠진다.
 * 판단이 바뀌면 목록에서 빼면 된다.
 */
export interface ExcludedTerm {
  slug: string;
  name: string;
  reason: '행정·계약' | '홍보·비교' | '중복' | '검증불가';
}

export const termsExcluded: ExcludedTerm[] = [
  // 진료 내용이 아니라 서류·계약·행정 절차에 대한 안내
  { slug: 'donguiseo', name: '동의서', reason: '행정·계약' },
  { slug: 'bigeubyeo-donguiseo', name: '비급여 동의서', reason: '행정·계약' },
  { slug: 'chiryo-donguiseo', name: '치료 동의서', reason: '행정·계약' },
  { slug: 'bigeubyeo-jinryobi-gonggae', name: '비급여 진료비 공개', reason: '행정·계약' },
  { slug: 'chigwa-bigeubyeo-gagyeog-gonggae', name: '치과 비급여 가격 공개', reason: '행정·계약' },
  { slug: 'seontaegjinryobi', name: '선택진료비', reason: '행정·계약' },
  { slug: 'chigwa-jinryobi-yeongsujeung', name: '치과 진료비 영수증', reason: '행정·계약' },
  { slug: 'chigwa-jinryobi-sebu-sanjeong-gijun', name: '치과 진료비 세부 산정 기준', reason: '행정·계약' },
  { slug: 'chigwa-bunhalnabbu', name: '치과 분할납부', reason: '행정·계약' },
  { slug: 'biyong-sangdam', name: '비용 상담', reason: '행정·계약' },
  { slug: 'cheos-sangdam', name: '첫 상담', reason: '행정·계약' },
  { slug: 'jinryo-girog-balgeub', name: '진료 기록 발급', reason: '행정·계약' },
  { slug: 'yeongmun-jinryogirog', name: '영문 진료기록', reason: '행정·계약' },
  { slug: 'chigwa-girog', name: '치과 기록', reason: '행정·계약' },
  { slug: 'chigwa-bojeungseo', name: '치과 보증서', reason: '행정·계약' },
  { slug: 'impeulranteu-bojeung', name: '임플란트 보증', reason: '행정·계약' },
  { slug: 'chigwa-gamyeomgwanri', name: '치과 감염관리', reason: '행정·계약' },
  { slug: 'chigwa-wisaengsa', name: '치과 위생사', reason: '행정·계약' },

  // 병원 선택을 유도하는 비교·홍보성 항목
  { slug: 'haeoe-impeulranteu-bigyo', name: '해외 임플란트 비교', reason: '홍보·비교' },
  { slug: 'dijiteol-chigwa', name: '디지털 치과', reason: '홍보·비교' },
  { slug: 'dijiteol-wokeupeulrou', name: '디지털 워크플로우', reason: '홍보·비교' },
  { slug: 'dijiteol-bocheol', name: '디지털 보철', reason: '홍보·비교' },
  { slug: 'dijiteol-impeulranteu', name: '디지털 임플란트', reason: '홍보·비교' },
  { slug: 'dijiteol-seumail-dijain', name: '디지털 스마일 디자인', reason: '홍보·비교' },

  // 이미 쓴 용어와 같은 뜻 — 한쪽만 남긴다
  { slug: 'ismom-jeoljesul', name: '잇몸 절제술', reason: '중복' }, // → 치은 절제술
  { slug: 'ismom-isigsul', name: '잇몸 이식술', reason: '중복' }, // → 잇몸이식
  { slug: 'ismom-seonghyeong', name: '잇몸 성형', reason: '중복' }, // → 잇몸 성형술
  { slug: 'chieun-bihu', name: '치은 비후', reason: '중복' }, // → 치은 비대
  { slug: 'chieun-jeungsig', name: '치은 증식', reason: '중복' }, // → 치은 비대
  { slug: 'dangnyo-hwanja-gugang-gwanri', name: '당뇨 환자 구강 관리', reason: '중복' }, // → 당뇨 환자 치과
  { slug: 'dangnyowa-guganggeongang', name: '당뇨와 구강건강', reason: '중복' }, // → 당뇨 환자 치과
  { slug: 'gugangam-jagageomjin', name: '구강암 자가검진', reason: '중복' }, // → 구강암
  { slug: 'gugangam-jogi-jinghu', name: '구강암 조기 징후', reason: '중복' }, // → 구강암
  { slug: 'seolam', name: '설암', reason: '중복' }, // → 구강암
  { slug: 'gugang-pyeonpyeongsepoam', name: '구강 편평세포암', reason: '중복' }, // → 구강암
  { slug: 'noin-guganggeonjojeung', name: '노인 구강건조증', reason: '중복' }, // → 구강건조증
  { slug: 'pyegyeonggi-guganggeonjo', name: '폐경기 구강건조', reason: '중복' }, // → 구강건조증
  // 현재 표준 용어는 '약물 관련 턱뼈 괴사(MRONJ)' — 약제가 비스포스포네이트로 한정되지 않는다
  {
    slug: 'biseuposeuponeiteu-gwanryeon-teogbbyeo-goesa',
    name: '비스포스포네이트 관련 턱뼈 괴사',
    reason: '중복',
  },

  { slug: 'imsi-keuraun', name: '임시 크라운', reason: '중복' }, // → 임시치아
  { slug: 'imsi-bocheolmul', name: '임시 보철물', reason: '중복' }, // → 임시치아
  { slug: 'bon-simenteu', name: '본 시멘트', reason: '중복' }, // → 치과용 시멘트
  { slug: 'imsi-simenteu', name: '임시 시멘트', reason: '중복' }, // → 치과용 시멘트
  { slug: 'bocheol-bondeu-simenteisyeon', name: '보철 본드 시멘테이션', reason: '중복' }, // → 치과용 시멘트
  { slug: 'impeulranteu-bocheol-jongryu', name: '임플란트 보철 종류', reason: '중복' }, // → 임플란트 보철
  { slug: 'imsang-keuraun', name: '임상 크라운', reason: '중복' }, // → 치관
  { slug: 'yeongguchi-maengchul-sunseo', name: '영구치 맹출 순서', reason: '중복' }, // → 치아 맹출 순서
  { slug: 'yeongguchi-iso-maengchul', name: '영구치 이소 맹출', reason: '중복' }, // → 이소 맹출
  { slug: 'chia-maengchul-jangae', name: '치아 맹출 장애', reason: '중복' }, // → 치아 맹출 지연

  { slug: 'gyojeong-wagseu', name: '교정 왁스', reason: '중복' }, // → 교정용 왁스
  { slug: 'selpeu-rigeiting-beurakes', name: '셀프 리게이팅 브라켓', reason: '중복' }, // 표기 차이
  { slug: 'gyojeong-jung-gwanri', name: '교정 중 관리', reason: '중복' }, // → 교정 중 구강 관리
  { slug: 'impeulranteu-silpae-wonin', name: '임플란트 실패 원인', reason: '중복' }, // → 임플란트 실패
  { slug: 'olonpo-impeulranteu', name: '올온포 임플란트', reason: '중복' }, // → All-on-4
  { slug: 'noin-impeulranteu-boheom', name: '노인 임플란트 보험', reason: '중복' }, // → 임플란트 건강보험
  { slug: 'maikeuro-impeulranteu', name: '마이크로 임플란트', reason: '중복' }, // → 미니 임플란트

  // 시술명이라기보다 홍보용 명칭
  { slug: 'wondei-impeulranteu', name: '원데이 임플란트', reason: '홍보·비교' },
  { slug: 'gonando-impeulranteu', name: '고난도 임플란트', reason: '홍보·비교' },
  { slug: 'sumyeon-impeulranteu', name: '수면 임플란트', reason: '홍보·비교' },
  { slug: 'geubsog-gyojeong', name: '급속 교정', reason: '홍보·비교' },

  // 표준 문헌에서 확인되지 않는 항목
  {
    slug: 'bosangsonibagjeolhanhyeobgweyangjeunghugun',
    name: '보상소니박절한협궤양증후군',
    reason: '검증불가',
  },
];

export const excludedSlugs = new Set(termsExcluded.map((t) => t.slug));
