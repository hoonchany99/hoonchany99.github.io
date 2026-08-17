/**
 * 표제어의 진짜 동의어 — 같은 대상을 가리키는 다른 이름만 담는다.
 *
 * aliases와 구분하는 이유:
 *   aliases는 블로그 태그에서 뽑은 검색 키워드 목록이라
 *   "레진가격", "임플란트비용" 같은 검색어와
 *   "충치 → 법랑질" 처럼 아예 다른 개념까지 섞여 있다.
 *   검색 매칭에는 그대로 쓰되, 화면의 "동의어"와
 *   DefinedTerm의 alternateName에는 이 목록만 내보낸다.
 *
 * 넣는 것:  줄임말(치아교정→교정), 구어(치주낭→잇몸주머니),
 *           띄어쓰기 변형(치아 크랙→치아크랙), 외래어 표기(이갈이→브럭시즘),
 *           같은 뜻의 한자어/고유어(뼈이식→골이식)
 * 빼는 것:  하위 종류(크라운→골드크라운), 구성 부품(임플란트→픽스쳐),
 *           관련 개념(신경치료→치수염), 검색 키워드(레진→레진가격),
 *           en 필드와 겹치는 영문명
 *
 * 여기 없는 표제어는 동의어 섹션을 띄우지 않는다. 없는 걸 지어내지 않는다.
 */
export const termSynonyms: Record<string, string[]> = {
  'all-on-4': ['올온포'],
  'apical-periodontitis': ['치근단염증'],
  apicoectomy: ['근단수술'],
  'bone-graft': ['골이식'],
  bruxism: ['브럭시즘'],
  calculus: ['치아돌'],
  caries: ['우식증'],
  cej: ['백악법랑경계'],
  'cracked-tooth': ['치아크랙', '치아균열', '금간치아', '크랙'],
  ct: ['CBCT'],
  'dental-checkup': ['치과검진', '구강검진'],
  denture: ['의치'],
  gbr: ['골유도재생술', '골재생술'],
  'gold-inlay': ['골드인레이'],
  'gum-graft': ['치은이식', '치은이식술'],
  halitosis: ['입냄새', '구취'],
  'immediate-implant': ['발치즉시임플란트', '즉시식립'],
  implant: ['인공치근'],
  mih: ['제1대구치 저형성증'],
  molar: ['구치'],
  'nitrous-oxide': ['아산화질소', 'N2O'],
  'occlusal-adjustment': ['물림조정'],
  orthodontics: ['교정'],
  osseointegration: ['뼈유착'],
  overdenture: ['임플란트틀니'],
  'pediatric-dentistry': ['어린이치과'],
  'peri-implantitis': ['임플란트주위염'],
  'periodontal-pocket': ['치주포켓', '잇몸주머니'],
  periodontitis: ['풍치'],
  'permanent-tooth': ['성인치'],
  pfm: ['금속도재크라운', 'PFM크라운'],
  'post-core': ['포스트코어', '치아기둥', '근관주'],
  'primary-tooth': ['젖니'],
  pulpotomy: ['치수절단', '소아신경치료'],
  resin: ['복합레진'],
  retainer: ['리테이너', '교정유지장치'],
  'root-canal': ['근관치료'],
  'root-canal-re': ['근관재치료', '재근관치료'],
  'rubber-dam': ['방수막'],
  scaling: ['치석제거'],
  'scaling-root-planing': ['SRP', '치근활택'],
  sealant: ['치아실란트'],
  sedation: ['수면치과', '의식하진정'],
  sensitivity: ['시림'],
  splint: ['나이트가드', '교합안정장치'],
  supernumerary: ['여분치아', '다생치'],
  'tooth-discoloration': ['치아변색', '변색', '누런이'],
  'tooth-fracture': ['치아파절', '치아부러짐'],
  'tooth-gem': ['치아보석'],
  whitening: ['미백'],
  'wisdom-tooth': ['지치', '제3대구치'],
  vestibuloplasty: ['구강전정성형술', '전정확장술'],
};
