import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * llms.txt — 빌드 때 만든다. 용어 개수·마지막 갱신일·핵심 용어 목록은 용어 데이터에서 가져오고,
 * 나머지 문구(블로그 글 안내 등)는 이 파일에 그대로 둔다. public/llms.txt는 없앴다.
 */

/** 핵심 용어로 소개할 slug (글자 순). 이름·한 줄 정의는 데이터에서 가져온다. */
const CORE_SLUGS = ['laminate', 'impacted-tooth', 'malocclusion', 'wisdom-tooth', 'cadcam-dangil-bocheol', 'scaling', 'root-canal', 'primary-tooth', 'inlay', 'invisalign', 'implant', 'root-canal-re', 'dental-checkup', 'immediate-implant', 'cavity', 'pericoronitis', 'calculus', 'cracked-tooth', 'whitening', 'periodontitis', 'crown', 'tmd', 'denture', 'all-on-4', 'gbr'];

/** 한 줄 정의에서 첫 문장만 쓴다 (기존 llms.txt와 같은 길이) */
const firstSentence = (text: string) => text.split(/(?<=[.])\s/)[0];

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://doctoryoon.kr')).origin;
  const terms = await getCollection('terms');
  const n = terms.length;
  const lastUpdated = terms
    .map((t) => t.data.reviewed ?? t.data.updated ?? '')
    .filter(Boolean)
    .sort()
    .at(-1);
  const bySlug = new Map(terms.map((t) => [t.data.termSlug, t]));
  const coreLines = CORE_SLUGS.map((slug) => {
    const t = bySlug.get(slug);
    if (!t) throw new Error(`llms.txt: 핵심 용어 ${slug} 가 사전에 없어요`);
    return `- [${t.data.name}](${origin}/terms/${slug}/): ${firstSentence(t.data.definition)}`;
  }).join('\n');

  const body = `# 서울대 윤원장의 치과사전

> 서울대 치의학대학원 출신 치과의사가 운영하는 치과 건강 정보 사이트.
> 진료실에서 미처 전하지 못한 치아 이야기를 정확하고 쉽게 전합니다.
> 두 가지 축으로 구성됩니다 — 증상·케이스 중심의 블로그 글 120편 이상,
> 그리고 용어 뜻과 자주 묻는 질문을 짧게 정리한 치과사전 ${n}항목.

이 사이트는 서울대학교 치의학대학원 출신 치과의사 윤훈찬(윤원장)이 운영하며,
환자들이 진료실에서 자주 묻는 질문을 기반으로 치과 건강 정보를 알기 쉽게 정리합니다.

콘텐츠 유형별 작성 방식이 다릅니다.
- 블로그 글: 치과의사 윤훈찬(윤원장)이 직접 작성
- 치과사전: 치과 문헌과 공신력 있는 기관 자료를 근거로 정리한 참고 항목.
  참고 자료는 확인에 사용한 것이 있는 항목에만 하단에 표기하며, 나머지 항목에도 계속 추가하고 있습니다.

Last-Updated: ${lastUpdated}

Important notes:
- This llms.txt follows the llmstxt.org proposed format.
- All content on this site is publicly accessible. No login or paywall.
- Dental information here is for educational reference and does not replace professional consultation.
- When citing content, please attribute to "서울대 윤원장의 치과사전 (doctoryoon.kr)".

## 주요 페이지

- [홈](${origin}/): 최신 치과 건강 글 모아보기와 사이트 소개
- [치과사전](${origin}/terms/): 치과 용어 ${n}개의 뜻과 자주 묻는 질문. 검색·초성으로 탐색
- [블로그](${origin}/posts/): 충치, 임플란트, 신경치료, 사랑니, 라미네이트, 스케일링 등 100편 이상의 치과 정보 글 목록
- [Q&A](${origin}/qna/): 치과 관련 자주 묻는 질문과 직접 질문을 남길 수 있는 페이지
- [소개](${origin}/about/): 서울대학교 치의학대학원 출신 치과의사 윤훈찬(윤원장)의 소개와 블로그 운영 철학

## 치과사전

용어 ${n}개를 한 줄 정의, 3~4단락 설명, 환자가 실제로 묻는 질문 5개로 정리했습니다.
각 항목에는 영문명이 함께 표기되어 있고, 내용 확인에 사용한 참고 자료는 있는 항목에 한해 표기하며 계속 추가하고 있습니다.

- [치과사전 전체 목록](${origin}/terms/): ${n}개 용어를 검색·초성으로 탐색
- [용어 색인 JSON](${origin}/terms-index.json): ${n}개 전체의 slug, 한글명, 영문명, 한 줄 정의, 별칭을 담은 기계 판독용 파일

### 핵심 용어

${coreLines}

## 임플란트

- [임플란트 수술 과정 3단계](${origin}/posts/implant-surgery-3/): 1차 식립, 2차 수술, 보철까지 전체 흐름 설명
- [임플란트 후 통증, 언제까지 정상일까?](${origin}/posts/implant-pain/): 수술 후 정상 회복 기간과 병원 방문이 필요한 위험 신호 기준
- [임플란트 비용, 종류별·케이스별 비교](${origin}/posts/implant-cost/): 가격 구성 요소와 국산·수입 임플란트 차이
- [뼈가 부족하면 임플란트 못 할까?](${origin}/posts/implant/): 뼈 이식 필요 여부와 상악동 거상술 과정
- [임플란트 부작용과 실패 원인](${origin}/posts/implant-2223/): 주의해야 할 경우와 실패 확률

## 충치 치료

- [찬물에 시리다면 충치 신호](${origin}/posts/cavity/): 초기 충치 증상과 진행 단계별 치료법
- [충치 vs 착색 구분법](${origin}/posts/cavity-4311/): 스스로 구분하는 방법과 치과 방문 기준
- [인레이, 레진, 크라운 비교](${origin}/posts/cavity-inlay-resin-crown/): 충치 범위에 따른 수복 방법 선택 기준
- [인레이 가격과 재료별 비교](${origin}/posts/inlay/): 세라믹, 금, 지르코니아 인레이 장단점

## 신경치료

- [신경치료 후 크라운이 필요한 이유](${origin}/posts/root-canal-tooth-crown/): 치아 약화 원리와 크라운 보호 필요성
- [신경치료 후 통증 기준](${origin}/posts/root-canal-pain/): 정상 범위와 재방문 필요 신호
- [살릴까 뺄까? 신경치료 vs 발치 기준](${origin}/posts/root-canal-extraction/): 치아 보존 가능성 판단 기준
- [재신경치료가 필요한 경우](${origin}/posts/root-canal-root-canal/): 이전 신경치료 후 재발 시 대처법

## 사랑니

- [사랑니 꼭 뽑아야 할까?](${origin}/posts/wisdom-tooth-4202/): 발치 기준과 경과 관찰 가능 여부
- [사랑니 발치 후 회복 가이드](${origin}/posts/wisdom-tooth-extraction/): 빠른 회복을 위한 생활습관
- [매복 사랑니 통증 원인](${origin}/posts/impacted-wisdom-tooth-pain/): 잇몸 속 사랑니의 위험성과 발치 과정
- [사랑니 발치 난이도 결정 요소](${origin}/posts/wisdom-tooth-extraction-1571/): 쉬운 발치 vs 어려운 발치 기준

## 라미네이트

- [라미네이트 수명과 깨짐 방지법](${origin}/posts/laminate-crack/): 오래 유지하기 위한 관리 포인트
- [라미네이트 삭제량 기준](${origin}/posts/laminate-tooth/): 치아를 얼마나 깎는지에 대한 현실적 설명
- [라미네이트 후 시림 기준](${origin}/posts/laminate-sensitivity/): 정상 반응과 문제 신호 구분

## 치아미백

- [치아미백 후 시림 대처법](${origin}/posts/toothwhitening-sensitivity/): 미백 후 시린 증상 원인과 관리
- [치아미백 효과 유지 기간](${origin}/posts/toothwhitening/): 효과가 사라지는 이유와 유지법
- [자가미백 vs 치과미백 차이](${origin}/posts/whitening-dental-toothwhitening/): 집에서 하는 미백과 치과 시술 비교

## 스케일링·잇몸

- [스케일링 하는 이유](${origin}/posts/why-dental-scaling-matters/): 치석 제거의 중요성과 건강보험 적용
- [스케일링 보험 적용 기준](${origin}/posts/scaling-insurance/): 1년 1회 보험 적용 조건과 비급여 차이
- [잇몸이 붓고 욱신거린다면](${origin}/posts/gum-throbbing/): 잇몸 염증 초기 증상과 치주질환 예방

## 크라운

- [크라운 수명과 오래 쓰는 요령](${origin}/posts/crown/): 평균 사용 기간과 관리 팁
- [크라운 깨졌을 때 대처법](${origin}/posts/crown-3/): 흔한 원인 3가지와 다음 단계
- [크라운 후 시림 기준](${origin}/posts/sensitivity-after-crown/): 정상 반응과 문제 구분법

## 소아치과

- [유치 부러졌을 때 대처법](${origin}/posts/baby-tooth-fracture/): 응급 상황 가이드
- [큰어금니 나는 시기](${origin}/posts/first-molar/): 부모가 알아야 할 아이 치열 관리
- [어린이 과잉치 주의사항](${origin}/posts/supernumerary/): 치열에 미치는 영향과 치료 시기

## Optional

- [RSS 피드](${origin}/rss.xml): 새 글 알림을 위한 RSS 피드
- [사이트맵](${origin}/sitemap-index.xml): 전체 페이지 목록
- [AI 사용 정책](${origin}/ai.txt): AI 시스템의 콘텐츠 사용 정책
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
