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
  reason:
    | '행정·계약'
    | '홍보·비교'
    | '중복'
    | '검증불가'
    /** 진료 기록·강의에나 쓰는 술어. 환자가 찾지 않는다 */
    | '임상용어'
    /** 치식 번호 체계. 사전 항목이 아니라 표기 규칙이다 */
    | '치아번호'
    /** 기구·장비·제조사명 */
    | '장비·브랜드'
    /** 제도·법령·수가 안내 */
    | '행정·제도';
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

  { slug: 'eotaechimeonteu', name: '어태치먼트', reason: '중복' }, // → 어태치먼트 의치
  { slug: 'keompojis-rejin', name: '컴포짓 레진', reason: '중복' }, // → 레진
  { slug: 'chia-saegsang-cheugjeong', name: '치아 색상 측정', reason: '중복' }, // → 보철 색조 선택
  { slug: 'chigwa-jaeryo', name: '치과 재료', reason: '중복' }, // 상위 개념 — 개별 재료로 대체
  { slug: 'chia-seonghyeong', name: '치아 성형', reason: '홍보·비교' },
  { slug: 'chia-saeg-bogwon', name: '치아 색 복원', reason: '홍보·비교' },

  // ── 2026-08-16 일괄 정리: 환자용 사전에 맞지 않는 항목 ──
  { slug: 'geunsim', name: '근심', reason: '임상용어' },
  { slug: 'wonsim', name: '원심', reason: '임상용어' },
  { slug: 'geunsimmyeonwonsimmyeon', name: '근심면/원심면', reason: '임상용어' },
  { slug: 'injeobmyeon', name: '인접면', reason: '임상용어' },
  { slug: 'sunmyeon', name: '순면', reason: '임상용어' },
  { slug: 'suncheug', name: '순측', reason: '임상용어' },
  { slug: 'seolmyeon', name: '설면', reason: '임상용어' },
  { slug: 'yeolgu', name: '열구', reason: '임상용어' },
  { slug: 'sowayeolgu', name: '소와열구', reason: '임상용어' },
  { slug: 'chigyeongbu', name: '치경부', reason: '임상용어' },
  { slug: 'majin', name: '마진', reason: '임상용어' },
  { slug: 'jeongjungseon', name: '정중선', reason: '임상용어' },
  { slug: 'aggung', name: '악궁', reason: '임상용어' },
  { slug: 'yehu', name: '예후', reason: '임상용어' },
  { slug: 'jeogeungjeung', name: '적응증', reason: '임상용어' },
  { slug: 'geumgijeung', name: '금기증', reason: '임상용어' },
  { slug: 'juso', name: '주소', reason: '임상용어' },
  { slug: 'jeonmun-yongeo', name: '전문 용어', reason: '임상용어' },
  { slug: 'daehabchi', name: '대합치', reason: '임상용어' },
  { slug: 'jeongchul', name: '정출', reason: '임상용어' },
  { slug: 'chongsaeng', name: '총생', reason: '임상용어' },
  { slug: 'insang', name: '인상', reason: '임상용어' },
  { slug: 'insang-chaedeug', name: '인상 채득', reason: '임상용어' },
  { slug: 'mogeob', name: '목업', reason: '임상용어' },
  { slug: 'wagseu', name: '왁스', reason: '임상용어' },
  { slug: 'seoggo', name: '석고', reason: '임상용어' },
  { slug: 'seogsyeon', name: '석션', reason: '임상용어' },
  { slug: 'gonggan', name: '공간', reason: '임상용어' },
  { slug: 'je1daeguchi', name: '제1대구치', reason: '치아번호' },
  { slug: 'je2daeguchi', name: '제2대구치', reason: '치아번호' },
  { slug: 'je1soguchi', name: '제1소구치', reason: '치아번호' },
  { slug: 'je2soguchi', name: '제2소구치', reason: '치아번호' },
  { slug: 'jungjeolchi', name: '중절치', reason: '치아번호' },
  { slug: 'cheugjeolchi', name: '측절치', reason: '치아번호' },
  { slug: 'jeolchi', name: '절치', reason: '치아번호' },
  { slug: 'soguchi', name: '소구치', reason: '치아번호' },
  { slug: 'yugyeonchi', name: '유견치', reason: '치아번호' },
  { slug: 'yuguchi', name: '유구치', reason: '치아번호' },
  { slug: 'yujeolchi', name: '유절치', reason: '치아번호' },
  { slug: '3d-peurinting', name: '3D 프린팅', reason: '장비·브랜드' },
  { slug: '3d-peurinting-chigwa', name: '3D 프린팅 치과', reason: '장비·브랜드' },
  { slug: 'dijiteol-senseo', name: '디지털 센서', reason: '장비·브랜드' },
  { slug: 'dijiteol-insang', name: '디지털 인상', reason: '장비·브랜드' },
  { slug: 'dijiteol-gyohab-bunseoggi', name: '디지털 교합 분석기', reason: '장비·브랜드' },
  { slug: 'milring-meosin', name: '밀링 머신', reason: '장비·브랜드' },
  { slug: 'reijeo', name: '레이저', reason: '장비·브랜드' },
  { slug: 'daiodeu-reijeo', name: '다이오드 레이저', reason: '장비·브랜드' },
  { slug: 'gugang-seukaeneo', name: '구강 스캐너', reason: '장비·브랜드' },
  { slug: 'gwangjunghab', name: '광중합', reason: '장비·브랜드' },
  { slug: 'gwangjunghabgi', name: '광중합기', reason: '장비·브랜드' },
  { slug: 'gyohabgi', name: '교합기', reason: '장비·브랜드' },
  { slug: 'insangjae', name: '인상재', reason: '장비·브랜드' },
  { slug: 'insangjae-jongryu', name: '인상재 종류', reason: '장비·브랜드' },
  { slug: 'inteuraoreol-kamera', name: '인트라오럴 카메라', reason: '장비·브랜드' },
  { slug: 'eeo-syawo', name: '에어 샤워', reason: '장비·브랜드' },
  { slug: 'eeo-eobeureisyeon', name: '에어 어브레이션', reason: '장비·브랜드' },
  { slug: 'otokeulreibeu', name: '오토클레이브', reason: '장비·브랜드' },
  { slug: 'otokeulreibeu-myeolgyun', name: '오토클레이브 멸균', reason: '장비·브랜드' },
  { slug: 'ilhoeyong-gigu', name: '일회용 기구', reason: '장비·브랜드' },
  { slug: 'uiryopyegimul', name: '의료폐기물', reason: '장비·브랜드' },
  { slug: 'seuteurauman', name: '스트라우만', reason: '장비·브랜드' },
  { slug: 'oseutem', name: '오스템', reason: '장비·브랜드' },
  { slug: 'selreg', name: '셀렉', reason: '장비·브랜드' },
  { slug: 'neo', name: '네오', reason: '장비·브랜드' },
  { slug: 'geulrouneiteu', name: '글로우네이트', reason: '장비·브랜드' },
  { slug: 'abjeon-susulgi', name: '압전 수술기', reason: '장비·브랜드' },
  { slug: 'asanhwajilso-jinjeong-jangchi', name: '아산화질소 진정 장치', reason: '장비·브랜드' },
  { slug: 'choeumpa-seukeilreo', name: '초음파 스케일러', reason: '장비·브랜드' },
  { slug: 'misehyeonmigyeong', name: '미세현미경', reason: '장비·브랜드' },
  { slug: 'maikeuroseukopeu', name: '마이크로스코프', reason: '장비·브랜드' },
  { slug: 'chapyemag', name: '차폐막', reason: '장비·브랜드' },
  { slug: 'susanhwakalsyum', name: '수산화칼슘', reason: '장비·브랜드' },
  { slug: 'gutapereuka', name: '구타페르카', reason: '장비·브랜드' },
  { slug: 'bondingje', name: '본딩제', reason: '장비·브랜드' },
  { slug: 'dairegteu-bonding', name: '다이렉트 본딩', reason: '장비·브랜드' },
  { slug: 'jangbigisul', name: '장비·기술', reason: '장비·브랜드' },
  { slug: 'uiryobeob', name: '의료법', reason: '행정·제도' },
  { slug: 'uiryobi-seaeggongje', name: '의료비 세액공제', reason: '행정·제도' },
  { slug: 'oegugin-hwanja-jinryo', name: '외국인 환자 진료', reason: '행정·제도' },
  { slug: 'uiryogwangwang-chigwa', name: '의료관광 치과', reason: '행정·제도' },
  { slug: 'wokeuin-jinryo', name: '워크인 진료', reason: '행정·제도' },
  { slug: 'chigwa-uiryo-bunjaeng', name: '치과 의료 분쟁', reason: '행정·제도' },
  { slug: 'chigwa-jeonmunui-jedo', name: '치과 전문의 제도', reason: '행정·제도' },
  { slug: 'chigwa-sanjeongteugrye', name: '치과 산정특례', reason: '행정·제도' },
  { slug: 'chigwa-uiryogeubyeo', name: '치과 의료급여', reason: '행정·제도' },
  { slug: 'chigwa-boninbudamgeum', name: '치과 본인부담금', reason: '행정·제도' },
  { slug: 'chigwa-eunggeub-jinryo-suga', name: '치과 응급 진료 수가', reason: '행정·제도' },
  { slug: 'rikol-siseutem', name: '리콜 시스템', reason: '행정·제도' },
  { slug: 'gamyeom-gwanri', name: '감염 관리', reason: '행정·제도' },
  { slug: 'gyocha-gamyeom', name: '교차 감염', reason: '행정·제도' },
  { slug: 'myeolgyun-siseutem', name: '멸균 시스템', reason: '행정·제도' },
  { slug: 'gugang-bogeon-gyoyug', name: '구강 보건 교육', reason: '행정·제도' },
  { slug: 'geubyeo-hangmog', name: '급여 항목', reason: '행정·제도' },
  { slug: 'bigeubyeo-hangmog', name: '비급여 항목', reason: '행정·제도' },
  { slug: 'bigeubyeo-chiryo', name: '비급여 치료', reason: '행정·제도' },
  { slug: 'geongangboheom-jeogyong-chiryo', name: '건강보험 적용 치료', reason: '행정·제도' },
  { slug: 'boheombiyong', name: '보험·비용', reason: '행정·제도' },
  { slug: 'silbiboheom', name: '실비보험', reason: '행정·제도' },
  { slug: 'silbiboheom-cheonggu', name: '실비보험 청구', reason: '행정·제도' },
  { slug: 'silson-boheom-chigwa', name: '실손 보험 치과', reason: '행정·제도' },
  { slug: 'eorini-chigwa-boheom', name: '어린이 치과 보험', reason: '행정·제도' },
  { slug: '4dae-jungjeung-jilhwan-chigwa-bojang', name: '4대 중증 질환 치과 보장', reason: '행정·제도' },
  { slug: 'jeonsin-geongang', name: '전신 건강', reason: '행정·제도' },
  { slug: 'bojongwa', name: '보존과', reason: '행정·제도' },
  { slug: 'bocheolgwa', name: '보철과', reason: '행정·제도' },
  { slug: 'gugang-oegwa', name: '구강 외과', reason: '행정·제도' },
  { slug: 'gugangnaegwa-jilhwan', name: '구강내과 질환', reason: '행정·제도' },
  { slug: 'seupocheu-chigwa', name: '스포츠 치과', reason: '행정·제도' },
  { slug: 'yeoseongimsanbu-chigwa', name: '여성·임산부 치과', reason: '행정·제도' },
  { slug: '2cha-uigyeon', name: '2차 의견', reason: '행정·제도' },
  { slug: 'bocheol-sijeog', name: '보철 시적', reason: '행정·제도' },
  { slug: 'gugang-gwanri', name: '구강 관리', reason: '행정·제도' },
  { slug: 'chigwa-biyong', name: '치과 비용', reason: '행정·제도' },
  { slug: 'deurai-sokes', name: '드라이 소켓', reason: '중복' },
  { slug: 'gugang-hereupeseu', name: '구강 헤르페스', reason: '중복' },
  { slug: 'gugang-jagyeolgam-jeunghugun', name: '구강 작열감 증후군', reason: '중복' },
  { slug: 'geulraeseu-aionomeo', name: '글래스 아이오노머', reason: '중복' },
  { slug: 'miniseukeuryu', name: '미니스크류', reason: '중복' },
  { slug: 'gugangwisaenggwanri', name: '구강위생관리', reason: '중복' },
  { slug: 'gol-isigsul', name: '골 이식술', reason: '중복' },
  { slug: 'dongjonggol-isig', name: '동종골 이식', reason: '중복' },
  { slug: 'ijonggol-isig', name: '이종골 이식', reason: '중복' },
  { slug: 'ijonggol-isigjae', name: '이종골 이식재', reason: '중복' },
  { slug: 'jagagol-isig', name: '자가골 이식', reason: '중복' },
  { slug: 'beulroggol-isig', name: '블록골 이식', reason: '중복' },
  { slug: 'sumyeonchiryo', name: '수면치료', reason: '중복' },
  { slug: 'sumyeon-jinjeong', name: '수면 진정', reason: '중복' },
  { slug: 'jinjeong-chiryo', name: '진정 치료', reason: '중복' },
  { slug: 'separo-bunseog', name: '세파로 분석', reason: '중복' },
  { slug: 'sepalro-xseon', name: '세팔로 X선', reason: '중복' },
  { slug: 'egseurei', name: '엑스레이', reason: '중복' },
  { slug: 'selpeu-raigeiting-beurakes', name: '셀프 라이게이팅 브라켓', reason: '중복' },
  { slug: 'susul-hu-gugang-gwanri', name: '수술 후 구강 관리', reason: '중복' },
  { slug: 'gugang-badag-bongwajigyeom', name: '구강 바닥 봉와직염', reason: '중복' },
  { slug: 'gugangjeo-bongwajigyeom', name: '구강저 봉와직염', reason: '중복' },
  { slug: 'sujigjeog-golheubsu', name: '수직적 골흡수', reason: '중복' },
  { slug: 'supyeongjeog-golheubsu', name: '수평적 골흡수', reason: '중복' },
  { slug: 'sujig-goljeungdaesul', name: '수직 골증대술', reason: '중복' },
  { slug: 'supyeong-goljeungdaesul', name: '수평 골증대술', reason: '중복' },
  { slug: 'botogseu-chiryo', name: '보톡스 치료', reason: '중복' },
  { slug: 'botulrinum', name: '보툴리눔', reason: '중복' },
  { slug: 'sokes-bojonsul', name: '소켓 보존술', reason: '중복' },
  { slug: 'jojig-jaesaeng-yudosul', name: '조직 재생 유도술', reason: '중복' },
  { slug: 'jaga-chia-isig', name: '자가 치아 이식', reason: '중복' },
  { slug: 'jagachia-isigjae', name: '자가치아 이식재', reason: '중복' },
  { slug: 'chigwa-eunggeub-sanghwang', name: '치과 응급 상황', reason: '중복' },
  { slug: 'gugang-daesangpojin', name: '구강 대상포진', reason: '중복' },
  { slug: 'naebu-heubsu', name: '내부 흡수', reason: '중복' },
  { slug: 'oebu-heubsu', name: '외부 흡수', reason: '중복' },
  { slug: 'bojonjeog-chiryo', name: '보존적 치료', reason: '중복' },
  { slug: 'ganjeob-subog', name: '간접 수복', reason: '중복' },
  { slug: 'jigjeob-subog', name: '직접 수복', reason: '중복' },
  { slug: 'sangajil-usig', name: '상아질 우식', reason: '중복' },
  { slug: 'beobrangjil-usig', name: '법랑질 우식', reason: '중복' },
  { slug: 'geunsimmyeon-usig', name: '근심면 우식', reason: '중복' },
  { slug: 'bangsaseon-usig', name: '방사선 우식', reason: '중복' },
  { slug: 'gugang-sejeonggi', name: '구강 세정기', reason: '중복' },
  { slug: 'gugang-sejeongje', name: '구강 세정제', reason: '중복' },
  { slug: 'bulso-banisi', name: '불소 바니시', reason: '중복' },
  { slug: 'gyochagyohab', name: '교차교합', reason: '중복' },
  { slug: 'aggan-gomujul', name: '악간 고무줄', reason: '중복' },
  { slug: 'gyojeongyong-tanseongchein', name: '교정용 탄성체인', reason: '중복' },
  { slug: 'gyojeong-baendeu', name: '교정 밴드', reason: '중복' },
  { slug: 'gyojeong-gomujul', name: '교정 고무줄', reason: '중복' },
  { slug: 'gyojeongyong-wagseu', name: '교정용 왁스', reason: '중복' },
  { slug: 'yuri-chieun-isigsul', name: '유리 치은 이식술', reason: '중복' },
  { slug: 'gyeolhabjojig-isigsul', name: '결합조직 이식술', reason: '중복' },
  { slug: 'ismom-seonghyeongsul', name: '잇몸 성형술', reason: '중복' },
  { slug: 'naebu-mibaeg', name: '내부 미백', reason: '중복' },
  { slug: 'woking-beulrichi', name: '워킹 블리치', reason: '중복' },
  { slug: 'ramineiteu-jongryu', name: '라미네이트 종류', reason: '중복' },
  { slug: 'rejin-inrei', name: '레진 인레이', reason: '중복' },
  { slug: 'seomyu-ganghwa-boghabrejin', name: '섬유 강화 복합레진', reason: '중복' },
  { slug: 'seramig', name: '세라믹', reason: '중복' },
  { slug: 'seramig-beurakes', name: '세라믹 브라켓', reason: '중복' },
  { slug: 'metal-beurakes', name: '메탈 브라켓', reason: '중복' },
  { slug: 'seuteuriping', name: '스트리핑', reason: '중복' },
  { slug: 'chia-jeobchag', name: '치아 접착', reason: '중복' },
  { slug: 'biseuposeuponeiteu', name: '비스포스포네이트', reason: '중복' },
  { slug: 'jeonag-impeulranteu', name: '전악 임플란트', reason: '중복' },
  { slug: 'jeonag-jaegeon', name: '전악 재건', reason: '중복' },
  { slug: 'jeugsi-roding', name: '즉시 로딩', reason: '중복' },
  { slug: 'impeulranteu-jaesusul', name: '임플란트 재수술', reason: '중복' },
  { slug: 'impeulranteu-sigi-juui', name: '임플란트 식이 주의', reason: '중복' },
  { slug: 'impeulranteu-bocheol', name: '임플란트 보철', reason: '중복' },
  { slug: 'syoteu-impeulranteu', name: '쇼트 임플란트', reason: '중복' },
  { slug: 'mini-impeulranteu', name: '미니 임플란트', reason: '중복' },
  { slug: 'jaigoma-impeulranteu', name: '자이고마 임플란트', reason: '중복' },
  { slug: 'gaideu-susul', name: '가이드 수술', reason: '중복' },
  { slug: 'chigwa-bonghab', name: '치과 봉합', reason: '중복' },
  { slug: 'jihyeol-cheochi', name: '지혈 처치', reason: '중복' },
  { slug: 'chigwa-soyeomje', name: '치과 소염제', reason: '중복' },
  { slug: 'mulri-chiryo', name: '물리 치료', reason: '중복' },
  { slug: 'gwanjeol-secheogsul', name: '관절 세척술', reason: '중복' },
  { slug: 'gugang-gadongbeomwi-jehan', name: '구강 가동범위 제한', reason: '중복' },
  { slug: 'gwaingchi-balchi', name: '과잉치 발치', reason: '중복' },
  { slug: 'uidojeog-jaesigsul', name: '의도적 재식술', reason: '중복' },
  { slug: 'bisimchijunang', name: '비심치주낭', reason: '중복' },
  { slug: 'geunbunjibu-byeongbyeon', name: '근분지부 병변', reason: '중복' },
  { slug: 'golgoesa', name: '골괴사', reason: '중복' },
  { slug: 'bangsaseon-golgoesa', name: '방사선 골괴사', reason: '중복' },
  { slug: 'bangsaseon-bangeo', name: '방사선 방어', reason: '중복' },
  { slug: 'bangsaseon-tugwasangbultugwasang', name: '방사선 투과상/불투과상', reason: '중복' },
  { slug: 'gugang-nae-chwalyeong', name: '구강 내 촬영', reason: '중복' },
  { slug: 'usig-wiheomdo-pyeongga', name: '우식 위험도 평가', reason: '중복' },
  { slug: 'baitalriti-teseuteu', name: '바이탈리티 테스트', reason: '중복' },
  { slug: 'jeongjungseon-bulilchi', name: '정중선 불일치', reason: '중복' },
  { slug: 'apni', name: '앞니', reason: '중복' },
  { slug: 'chigwa-eunggeub', name: '치과 응급', reason: '중복' },

  // ── 2026-08-16 2차 정리 ──
  { slug: 'peisyeonteu-peoneol', name: '페이션트 퍼널', reason: '홍보·비교' },
  { slug: 'hwanja-gyeongheom', name: '환자 경험', reason: '홍보·비교' },
  { slug: 'hwanja-yeojeong-jido', name: '환자 여정 지도', reason: '홍보·비교' },
  { slug: 'hwanja-bulman-cheori', name: '환자 불만 처리', reason: '홍보·비교' },
  { slug: 'hwanja-gyoyug-peurogeuraem', name: '환자 교육 프로그램', reason: '홍보·비교' },
  { slug: 'nps', name: 'NPS', reason: '홍보·비교' },
  { slug: 'prm', name: 'PRM', reason: '홍보·비교' },
  { slug: 'chigwa-kadeu-halbu', name: '치과 카드 할부', reason: '홍보·비교' },
  { slug: 'haengdong-jojeol', name: '행동 조절', reason: '홍보·비교' },
  { slug: 'keulrenjing', name: '클렌징', reason: '홍보·비교' },
  { slug: 'chigwayong-reijeo', name: '치과용 레이저', reason: '장비·브랜드' },
  { slug: 'chigwayong-maikeuroseukopeu', name: '치과용 마이크로스코프', reason: '장비·브랜드' },
  { slug: 'chigwayong-hyeonmigyeong', name: '치과용 현미경', reason: '장비·브랜드' },
  { slug: 'haendeupiseu', name: '핸드피스', reason: '장비·브랜드' },
  { slug: 'hoejeon-gigu', name: '회전 기구', reason: '장비·브랜드' },
  { slug: 'piejo-seojeori', name: '피에조 서저리', reason: '장비·브랜드' },
  { slug: 'led-gwangjunghabgi', name: 'LED 광중합기', reason: '장비·브랜드' },
  { slug: 'eryag-reijeo', name: 'Er:YAG 레이저', reason: '장비·브랜드' },
  { slug: 'clincheck', name: 'ClinCheck', reason: '장비·브랜드' },
  { slug: 'keulripissi', name: '클리피씨', reason: '장비·브랜드' },
  { slug: 'e-max', name: 'e.max', reason: '장비·브랜드' },
  { slug: 'peek', name: 'PEEK', reason: '장비·브랜드' },
  { slug: 'pmma', name: 'PMMA', reason: '장비·브랜드' },
  { slug: 'titanyum', name: '티타늄', reason: '장비·브랜드' },
  { slug: 'kolragen-membeurein', name: '콜라겐 멤브레인', reason: '장비·브랜드' },
  { slug: 'habseonggol-isig', name: '합성골 이식', reason: '장비·브랜드' },
  { slug: 'ai-yeongsang-pandog', name: 'AI 영상 판독', reason: '장비·브랜드' },
  { slug: 'ismom-reijeo-chiryo', name: '잇몸 레이저 치료', reason: '장비·브랜드' },
  { slug: 'peurobing', name: '프로빙', reason: '장비·브랜드' },
  { slug: 'peulrakeu-jisu', name: '플라크 지수', reason: '장비·브랜드' },
  { slug: 'bop', name: 'BOP', reason: '장비·브랜드' },
  { slug: 'keulraseupeu', name: '클라스프', reason: '장비·브랜드' },
  { slug: 'pontig', name: '폰틱', reason: '장비·브랜드' },
  { slug: 'puljireukonia', name: '풀지르코니아', reason: '장비·브랜드' },
  { slug: 'haibeurideu-seramig', name: '하이브리드 세라믹', reason: '장비·브랜드' },
  { slug: 'amalgam', name: '아말감', reason: '장비·브랜드' },
  { slug: 'mta', name: 'MTA', reason: '장비·브랜드' },
  { slug: 'prf', name: 'PRF', reason: '장비·브랜드' },
  { slug: 'ribeiseu', name: '리베이스', reason: '장비·브랜드' },
  { slug: 'chiuihag-jeonmunui', name: '치의학 전문의', reason: '행정·제도' },
  { slug: 'tonghabchiuihaggwa', name: '통합치의학과', reason: '행정·제도' },
  { slug: 'chigwa-jilhwan', name: '치과 질환', reason: '행정·제도' },
  { slug: 'chiryosisul', name: '치료·시술', reason: '행정·제도' },
  { slug: 'chia-boheom', name: '치아 보험', reason: '행정·제도' },
  { slug: 'chigwa-jintongje', name: '치과 진통제', reason: '행정·제도' },
  { slug: 'chigwa-hangsaengje', name: '치과 항생제', reason: '행정·제도' },
  { slug: 'habbyeongjeung', name: '합병증', reason: '행정·제도' },
  { slug: 'chiryo-gyehoeg', name: '치료 계획', reason: '행정·제도' },
  { slug: 'chia-geongang-chekeuriseuteu', name: '치아 건강 체크리스트', reason: '행정·제도' },
  { slug: 'yagmul-sanghojagyong', name: '약물 상호작용', reason: '행정·제도' },
  { slug: 'chisuchia-jilhwan', name: '치수·치아 질환', reason: '행정·제도' },
  { slug: 'chisig', name: '치식', reason: '치아번호' },
  { slug: 'chia-beonho', name: '치아 번호', reason: '치아번호' },
  { slug: 'chia-beonho-chegye', name: '치아 번호 체계', reason: '치아번호' },
  { slug: 'chia', name: '치아', reason: '치아번호' },
  { slug: 'chiyeol', name: '치열', reason: '치아번호' },
  { slug: 'hyeobmyeon', name: '협면', reason: '치아번호' },
  { slug: 'hyeobcheug', name: '협측', reason: '치아번호' },
  { slug: 'gyohabmyeon', name: '교합면', reason: '치아번호' },
  { slug: 'gyodu', name: '교두', reason: '치아번호' },
  { slug: 'gyeonchi', name: '견치', reason: '치아번호' },
  { slug: 'chia-gyomojeung', name: '치아 교모증', reason: '중복' },
  { slug: 'chia-miranjeung', name: '치아 미란증', reason: '중복' },
  { slug: 'chia-chimsigjeung', name: '치아 침식증', reason: '중복' },
  { slug: 'chia-isig', name: '치아 이식', reason: '중복' },
  { slug: 'chia-jaebuchag', name: '치아 재부착', reason: '중복' },
  { slug: 'chia-jaegeonsul', name: '치아 재건술', reason: '중복' },
  { slug: 'beoningmauseu-jeunghugun', name: '버닝마우스 증후군', reason: '중복' },
  { slug: 'ibmareumjeung', name: '입마름증', reason: '중복' },
  { slug: 'chigwa-pobia-geugbogbeob', name: '치과 포비아 극복법', reason: '중복' },
  { slug: 'chia-gujodo', name: '치아 구조도', reason: '중복' },
  { slug: 'chia-seoncheon-gyeolson', name: '치아 선천 결손', reason: '중복' },
  { slug: 'bronj', name: 'BRONJ', reason: '중복' },
  { slug: 'ssc', name: 'SSC', reason: '중복' },
  { slug: 'pis-aen-pisyeo-silranteu', name: '핏 앤 피셔 실란트', reason: '중복' },
  { slug: 'peurobaiotigseu-gugang', name: '프로바이오틱스 구강', reason: '중복' },
  { slug: 'all-on-6', name: 'All-on-6', reason: '중복' },
  { slug: 'cadcam-subog', name: 'CAD/CAM 수복', reason: '중복' },
  { slug: 'keulrieoeolraineo-buchagmul', name: '클리어얼라이너 부착물', reason: '중복' },
  { slug: 'pawochein', name: '파워체인', reason: '중복' },
  { slug: 'hedeugieo', name: '헤드기어', reason: '중복' },
  { slug: 'hwagjang-jangchi', name: '확장 장치', reason: '중복' },
  { slug: 'teog-seongjang-jangchi', name: '턱 성장 장치', reason: '중복' },
  { slug: 'chia-bohodae', name: '치아 보호대', reason: '중복' },
  { slug: 'taaeg', name: '타액', reason: '중복' },
  { slug: 'chia-jeongchul', name: '치아 정출', reason: '중복' },
  { slug: 'chia-hamib', name: '치아 함입', reason: '중복' },
  { slug: 'chia-cheugbang-byeonwi', name: '치아 측방 변위', reason: '중복' },
  { slug: 'chia-byeonwi', name: '치아 변위', reason: '중복' },
  { slug: 'chia-heubsu', name: '치아 흡수', reason: '중복' },
  { slug: 'chia-gwaminjeung', name: '치아 과민증', reason: '중복' },
  { slug: 'chia-heundeulrim', name: '치아 흔들림', reason: '중복' },
  { slug: 'chia-dongyo', name: '치아 동요', reason: '중복' },
  { slug: 'chiseong-nongyang', name: '치성 농양', reason: '중복' },
  { slug: 'aggol-golsuyeom', name: '악골 골수염', reason: '중복' },
  { slug: 'golsuyeom', name: '골수염', reason: '중복' },
  { slug: 'chia-balyug-isang', name: '치아 발육 이상', reason: '중복' },
  { slug: 'chia-sagje', name: '치아 삭제', reason: '중복' },
  { slug: 'chia-hyeongtae-sujeong', name: '치아 형태 수정', reason: '중복' },
  { slug: 'hyeo-sejeong', name: '혀 세정', reason: '중복' },
  { slug: 'chia-usig-hwalseong-geomsa', name: '치아 우식 활성 검사', reason: '중복' },
  { slug: 'taaeggeomsa', name: '타액검사', reason: '중복' },
  { slug: 'gugang-ihyeongseongjeung', name: '구강 이형성증', reason: '중복' },
  { slug: 'hongbanjeung', name: '홍반증', reason: '중복' },
  { slug: 'chieun-isig-jongryu', name: '치은 이식 종류', reason: '중복' },
  { slug: 'chia-yuchag', name: '치아 유착', reason: '중복' },
  { slug: '2cha-gyojeong', name: '2차 교정', reason: '중복' },
  { slug: 'chiae-nabbeun-seubgwan', name: '치아에 나쁜 습관', reason: '중복' },
  { slug: 'gugang-agseubgwan', name: '구강 악습관', reason: '중복' },
  { slug: 'chiae-joheun-eumsig', name: '치아에 좋은 음식', reason: '중복' },
  { slug: 'guchwi-woningwa-gwanri', name: '구취 원인과 관리', reason: '중복' },
  { slug: 'geumyeongwa-guganggeongang', name: '금연과 구강건강', reason: '중복' },
  { slug: 'gugang-jiuiryu-baneung', name: '구강 지의류 반응', reason: '중복' },
  { slug: 'nangjong', name: '낭종', reason: '중복' },
  { slug: 'chigeun-igaebu', name: '치근 이개부', reason: '중복' },
  { slug: 'suposeong-jilhwan', name: '수포성 질환', reason: '중복' },
  { slug: 'yusacheonpochang', name: '유사천포창', reason: '중복' },
  { slug: 'gugang-jeommag-cheonpochang', name: '구강 점막 천포창', reason: '중복' },
  { slug: 'chisu-bogjosul', name: '치수 복조술', reason: '중복' },
  { slug: 'chisu-chunghyeol', name: '치수 충혈', reason: '중복' },
  { slug: 'ganjeob-chisu-bogjo', name: '간접 치수 복조', reason: '중복' },
  { slug: 'gugang-baesepo-jongyang', name: '구강 배세포 종양', reason: '검증불가' },

  // 표준 문헌에서 확인되지 않는 항목
  {
    slug: 'bosangsonibagjeolhanhyeobgweyangjeunghugun',
    name: '보상소니박절한협궤양증후군',
    reason: '검증불가',
  },
];

export const excludedSlugs = new Set(termsExcluded.map((t) => t.slug));
