/**
 * 하나로 합쳐진 용어 — 없어진 주소(slug) → 남은 주소(slug).
 *
 * 같은 개념이 두 페이지로 나뉘어 있던 것을 한 페이지로 모았다(한 개념 한 페이지).
 * 여기 있는 slug는 용어 md·용어 목록(terms-index.json)·sitemap에서 빠지고,
 * astro.config.mjs가 옛 주소 /terms/<옛 slug>/ 를 남은 주소로 보내는 페이지(meta refresh + canonical + noindex)를 만든다.
 * 옛 이름은 남은 용어의 aliases·synonyms로 옮겨 검색이 이어지게 한다.
 * 이 목록의 slug를 relatedTerms·본문 링크에서 가리키면 check-terms가 막는다.
 * 본문 내용 합치기는 별도 작업(새 틀)에서 한다.
 */
export const mergedTerms: Record<string, string> = {
  /** 우식 → 충치 */
  caries: 'cavity',
  /** 세렉 → CAD/CAM 당일 보철 */
  cerec: 'cadcam-dangil-bocheol',
  /** 임플란트 신경 손상 → 하치조신경 손상 */
  'impeulranteu-singyeong-sonsang': 'hachijosingyeong-sonsang',
  /** 이갈이 증상 → 이갈이 */
  'igali-jeungsang': 'bruxism',
};

export const mergedSlugs = new Set(Object.keys(mergedTerms));

/**
 * 남은 용어가 받는 옛 이름·검색어 (terms-index.json의 aliases에 합쳐진다).
 * 충치는 termsRich·md에 직접 넣었고, 나머지는 자동 생성 파일(termsCanonical)을 건드리지 않으려고 여기 둔다.
 */
export const mergedAliases: Record<string, string[]> = {
  'cadcam-dangil-bocheol': ['세렉', 'CEREC', '캐드캠', '당일보철'],
  'hachijosingyeong-sonsang': ['임플란트 신경 손상'],
  bruxism: ['이갈이 증상'],
};

/**
 * 사전 밖의 옛 주소 → 새 주소. 같은 방식(meta refresh + canonical + noindex)으로 보낸다.
 * /치과사전/ 은 옛 Jekyll 블로그 이름(「윤원장의 치과사전」)이자 지금 메뉴 이름이라 사람들이 주소창에 칠 수 있는데 페이지는 없었다.
 */
export const legacyPaths: Record<string, string> = {
  '/치과사전/': '/terms/',
};
