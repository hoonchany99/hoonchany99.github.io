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

  { slug: 'impeulranteu-yujibosu', name: '임플란트 유지보수', reason: '중복' }, // → 임플란트 관리
  { slug: 'impeulranteu-hu-gwanri', name: '임플란트 후 관리', reason: '중복' }, // → 임플란트 관리
  { slug: 'impeulranteu-golyuchag-silpae', name: '임플란트 골유착 실패', reason: '중복' }, // → 임플란트 실패
  { slug: 'balchi-hu-jeugsi-impeulranteu', name: '발치 후 즉시 임플란트', reason: '중복' }, // → 즉시임플란트
  { slug: 'impeulranteu-imsichia', name: '임플란트 임시치아', reason: '중복' }, // → 임시치아
  { slug: 'keoseuteom-eobeoteumeonteu', name: '커스텀 어버트먼트', reason: '중복' }, // → 임플란트 어버트먼트
  { slug: 'sangagdongyeom', name: '상악동염', reason: '중복' }, // → 치성 상악동염 (치과 영역)
  {
    slug: 'cheugbang-jeobgeun-sangagdong-geosangsul',
    name: '측방 접근 상악동 거상술',
    reason: '중복',
  }, // → 상악동거상술
  {
    slug: 'chijojeong-jeobgeun-sangagdong-geosangsul',
    name: '치조정 접근 상악동 거상술',
    reason: '중복',
  }, // → 상악동거상술
  { slug: 'impeulranteu-insang', name: '임플란트 인상', reason: '중복' }, // → 임플란트 보철

  { slug: 'nebigeisyeon-impeulranteu', name: '네비게이션 임플란트', reason: '홍보·비교' },

  { slug: 'chia-oesang-daecheo', name: '치아 외상 대처', reason: '중복' }, // → 치아 외상
  { slug: 'chia-talgu', name: '치아 탈구', reason: '중복' }, // → 치아 외상
  { slug: 'chia-atalgu', name: '치아 아탈구', reason: '중복' }, // → 치아 외상
  { slug: 'chia-jaesigsul-hu-gwanri', name: '치아 재식술 후 관리', reason: '중복' }, // → 치아 재식술
  { slug: 'machwi', name: '마취', reason: '중복' }, // → 국소마취
  { slug: 'machwijinjeong', name: '마취·진정', reason: '중복' }, // → 국소마취, 수면치과·의식하진정
  { slug: 'chimyunmachwi', name: '침윤마취', reason: '중복' }, // → 국소마취
  { slug: 'susul-gaideu', name: '수술 가이드', reason: '중복' }, // → 가이드 수술
  { slug: 'chiju-panmag-susul', name: '치주 판막 수술', reason: '중복' }, // → 잇몸 수술
  { slug: 'peulraeb-susul', name: '플랩 수술', reason: '중복' }, // → 잇몸 수술
  { slug: 'teoggyojeong-susul', name: '턱교정 수술', reason: '중복' }, // → 악교정 수술
  { slug: 'teoggwanjeol-diseukeu', name: '턱관절 디스크', reason: '중복' }, // → 턱관절 디스크 변위
  { slug: 'mujeolgae-impeulranteu', name: '무절개 임플란트', reason: '홍보·비교' },
  { slug: 'teoggwanjeolgugangoegwa', name: '턱관절·구강외과', reason: '행정·계약' }, // 진료과 소개

  { slug: 'hyeo-baegtae', name: '혀 백태', reason: '중복' }, // → 설태
  { slug: 'hyeo-keulrineo', name: '혀 클리너', reason: '중복' }, // → 혀 세정
  {
    slug: 'gugang-geonjojeung-habbyeongjeung',
    name: '구강 건조증 합병증',
    reason: '중복',
  }, // → 구강건조증
  { slug: 'gugang-jeommag-jilhwan', name: '구강 점막 질환', reason: '중복' }, // 상위 개념 — 개별 용어로 대체

  // 방향·부위를 가리키는 술어라 사전 항목으로 두기 어려움
  { slug: 'seolcheug', name: '설측', reason: '중복' },
  { slug: 'hyeobcheugseolcheug', name: '협측/설측', reason: '중복' },

  { slug: 'hwanja-gyeongheom-seolgye', name: '환자 경험 설계', reason: '행정·계약' },

  { slug: 'olbareun-chissoljil-bangbeob', name: '올바른 칫솔질 방법', reason: '중복' }, // → 칫솔질
  { slug: 'chigwa-jeonggi-geomjin', name: '치과 정기 검진', reason: '중복' }, // → 정기검진
  { slug: 'chiju-jaesaeng-chiryo', name: '치주 재생 치료', reason: '중복' }, // → 치주 재생술
  { slug: 'chiju-jilhwan', name: '치주 질환', reason: '중복' }, // → 치은염, 치주염
  { slug: 'chijugwa', name: '치주과', reason: '행정·계약' }, // 진료과 소개
  { slug: 'yebang-chiuihag', name: '예방 치의학', reason: '행정·계약' }, // 학문 분야 소개
  { slug: 'seukeilring-hyeobjo', name: '스케일링 협조', reason: '검증불가' },

  { slug: 'panorama-chwalyeong', name: '파노라마 촬영', reason: '중복' }, // → 파노라마
  { slug: 'panorama-xseon', name: '파노라마 X선', reason: '중복' }, // → 파노라마
  { slug: 'chigeundan-chwalyeong', name: '치근단 촬영', reason: '중복' }, // → 치근단 방사선
  { slug: 'chigwa-ct', name: '치과 CT', reason: '중복' }, // → CT
  { slug: 'sangaggol', name: '상악골', reason: '중복' }, // → 상악
  { slug: 'haaggol', name: '하악골', reason: '중복' }, // → 하악
  { slug: 'sirini', name: '시린이', reason: '중복' }, // → 이시림
  { slug: 'boghabrejin', name: '복합레진', reason: '중복' }, // → 레진
  { slug: 'jeojbyeong-usigjeung', name: '젖병 우식증', reason: '중복' }, // → 유아 우식
  { slug: 'dijiteol-gugang-seukaen', name: '디지털 구강 스캔', reason: '중복' }, // → 구강 스캐너
  { slug: 'dijiteol-jindan-mohyeong', name: '디지털 진단 모형', reason: '중복' }, // → 구강 스캐너
  { slug: 'noin-guganggwanri', name: '노인 구강관리', reason: '중복' }, // → 노인 뿌리 우식 등 개별 용어
  { slug: 'yeonha-jangae', name: '연하 장애', reason: '중복' }, // → 노인 연하장애

  { slug: 'chigeundan-susul', name: '치근단 수술', reason: '중복' }, // → 치근단절제술
  { slug: 'geubsog-gugae-hwagjang', name: '급속 구개 확장', reason: '중복' }, // → 구개 확장 장치
  { slug: 'impeulranteu-sangagdong', name: '임플란트 상악동', reason: '중복' }, // → 상악동거상술

  { slug: 'teulni-gwanri', name: '틀니 관리', reason: '중복' }, // → 틀니 관리법
  { slug: 'teulni-geongangboheom', name: '틀니 건강보험', reason: '중복' }, // → 건강보험 적용 틀니
  { slug: 'je3daeguchi', name: '제3대구치', reason: '중복' }, // → 사랑니
  { slug: 'gugang-baegsaegpanjeung', name: '구강 백색판증', reason: '중복' }, // → 백반증
  { slug: 'chieun-byeonsaeg', name: '치은 변색', reason: '중복' }, // → 잇몸 색소침착
  { slug: 'cheos-chigwa-bangmun-sigi', name: '첫 치과 방문 시기', reason: '중복' }, // → 첫 치과 방문
  { slug: 'seupeulrinteu-chiryo', name: '스플린트 치료', reason: '중복' }, // → 스플린트
  { slug: 'chia-mibaeg-jongryu', name: '치아 미백 종류', reason: '중복' }, // → 치아미백
  { slug: 'chia-talsaeg', name: '치아 탈색', reason: '중복' }, // → 치아미백
  { slug: 'soa-bujeonggyohab', name: '소아 부정교합', reason: '중복' }, // → 부정교합, 소아 교정
  { slug: 'simmi-chigwa', name: '심미 치과', reason: '홍보·비교' },
  { slug: 'jeongmil-teulni', name: '정밀 틀니', reason: '홍보·비교' },

  // 표준 문헌에서 확인되지 않는 항목
  {
    slug: 'bosangsonibagjeolhanhyeobgweyangjeunghugun',
    name: '보상소니박절한협궤양증후군',
    reason: '검증불가',
  },
];

export const excludedSlugs = new Set(termsExcluded.map((t) => t.slug));
