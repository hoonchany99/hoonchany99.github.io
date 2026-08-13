export interface CanonicalTerm {
  slug: string;
  name: string;
  aliases: string[];
  topicSlug: string;
  definition: string;
}

/** doctorW voice로 풀 설명·FAQ가 있는 핵심 용어 (sync 시 bdbddc 목록과 병합) */
export const termsRich: CanonicalTerm[] = [
  {
    slug: 'cavity',
    name: '충치',
    aliases: ['충치', '충치치료', '2차충치', '충치레진', '충치이시림', '법랑질', '상아질'],
    topicSlug: 'cavity',
    definition:
      '충치는 세균이 만든 산으로 치아가 서서히 녹는 질환이에요. 처음엔 안 아플 수 있어서, 작을 때 잡는 게 가장 부담이 적은 경우가 많습니다.',
  },
  {
    slug: 'resin',
    name: '레진',
    aliases: ['레진', '레진치료', '레진치료비용', '치과레진', '레진가격', '레진깨짐', '충치레진비용'],
    topicSlug: 'cavity',
    definition:
      '레진은 충치 자리를 치아색 수지로 메우는 치료예요. 범위가 작으면 한 번 내원으로 끝나는 경우가 많아요.',
  },
  {
    slug: 'root-canal',
    name: '신경치료',
    aliases: ['신경치료', '재신경치료', '신경치료후통증', '근관', '치수염', '치근단'],
    topicSlug: 'cavity',
    definition:
      '신경치료는 치아 신경에 염증이 생겼을 때 신경을 제거하고 소독·충전하는 치료예요. 치아를 살리는 마지막 단계 중 하나라고 보시면 됩니다.',
  },
  {
    slug: 'inlay',
    name: '인레이',
    aliases: ['인레이', '인레이치료', '골드인레이', '세라믹인레이', 'CADCAM', '세렉'],
    topicSlug: 'crown-inlay',
    definition:
      '인레이는 레진으로는 부족할 때, 맞춤 보철물을 끼워 넣는 치료예요. 어금니 씹는 면처럼 힘이 큰 부위에 자주 쓰입니다.',
  },
  {
    slug: 'onlay',
    name: '온레이',
    aliases: ['온레이'],
    topicSlug: 'crown-inlay',
    definition:
      '온레이는 인레이보다 넓게 씹는 면까지 덮는 보철이에요. 크라운보다 덜 깎고 넓게 복원할 때 고려되는 경우가 많아요.',
  },
  {
    slug: 'crown',
    name: '크라운',
    aliases: ['크라운', '크라운치료', '치과크라운', '지르코니아크라운', '골드크라운', '세라믹크라운'],
    topicSlug: 'crown-inlay',
    definition:
      '크라운은 손상이 크거나 신경치료한 치아를 통째로 감싸 보호하는 씌우개예요. 씹는 힘을 분산해 깨짐을 줄이는 역할을 합니다.',
  },
  {
    slug: 'zirconia',
    name: '지르코니아',
    aliases: ['지르코니아', '지르코니아크라운', '지르코니아인레이'],
    topicSlug: 'crown-inlay',
    definition:
      '지르코니아는 강도가 높은 세라믹 재료예요. 금속 없이도 어금니·임플란트 보철에 쓰이는 경우가 많습니다.',
  },
  {
    slug: 'implant',
    name: '임플란트',
    aliases: ['임플란트', '임플란트비용', '임플란트가격', '임플란트수술', '픽스쳐', '어버트먼트'],
    topicSlug: 'implant',
    definition:
      '임플란트는 빠진 자리에 티타늄 기둥을 심고 인공치를 연결하는 치료예요. 옆 치아를 깎지 않아도 되는 점이 큰 장점이에요.',
  },
  {
    slug: 'bone-graft',
    name: '뼈이식',
    aliases: ['뼈이식', '골이식'],
    topicSlug: 'implant',
    definition:
      '뼈이식은 임플란트를 심을 뼈가 부족할 때 보강하는 시술이에요. 발치 후 오래 비운 자리에서 필요해지는 경우가 많습니다.',
  },
  {
    slug: 'sinus-lift',
    name: '상악동거상술',
    aliases: ['상악동', '상악동거상술'],
    topicSlug: 'implant',
    definition:
      '상악동거상술은 위 어금니 임플란트를 위해 부비동 바닥을 올리고 뼈를 채우는 수술이에요. 위쪽 뼈가 얇을 때 논의됩니다.',
  },
  {
    slug: 'peri-implantitis',
    name: '임플란트 주위염',
    aliases: ['임플란트주위염'],
    topicSlug: 'implant',
    definition:
      '임플란트 주위염은 임플란트 주변 잇몸·뼈에 염증이 생기는 상태예요. 자연치 치주염처럼 관리가 필요합니다.',
  },
  {
    slug: 'wisdom-tooth',
    name: '사랑니',
    aliases: ['사랑니', '사랑니발치', '사랑니통증', '사랑니발치통증', '매복사랑니', '수평사랑니', '사랑니발치비용'],
    topicSlug: 'wisdom-tooth',
    definition:
      '사랑니는 10대 후반~20대에 나는 어금니예요. 공간이 부족하거나 매복되면 염증·충치·앞니 밀림의 원인이 될 수 있어요.',
  },
  {
    slug: 'dry-socket',
    name: '건조와',
    aliases: ['건조와'],
    topicSlug: 'wisdom-tooth',
    definition:
      '건조와는 발치 후 혈병이 제대로 형성되지 않아 통증이 심해지는 합병증이에요. 흡연·빨대 사용이 위험 요인으로 알려져 있습니다.',
  },
  {
    slug: 'scaling',
    name: '스케일링',
    aliases: ['스케일링', '비보험스케일링', '스케일링보험'],
    topicSlug: 'gum-prevention',
    definition:
      '스케일링은 치석·치태를 제거하는 치료예요. 잇몸 건강·충치 예방에 기본이 되는 관리라고 보시면 됩니다.',
  },
  {
    slug: 'periodontitis',
    name: '치주염',
    aliases: ['치주염', '잇몸질환', '잇몸욱신'],
    topicSlug: 'gum-prevention',
    definition:
      '치주염은 잇몸뿐 아니라 치아를 지지하는 뼈까지 염증이 진행된 질환이에요. 초기엔 증상이 약해 방치되기 쉬운 편입니다.',
  },
  {
    slug: 'gingivitis',
    name: '치은염',
    aliases: ['치은염'],
    topicSlug: 'gum-prevention',
    definition:
      '치은염은 잇몸만 염증이 있는 단계예요. 스케일링·양치 개선으로 호전되는 경우가 많습니다.',
  },
  {
    slug: 'laminate',
    name: '라미네이트',
    aliases: ['라미네이트', '무삭제라미네이트', '제로네이트', '미니쉬'],
    topicSlug: 'laminate-whitening',
    definition:
      '라미네이트는 앞니에 얇은 세라믹 판을 붙여 모양·색을 바꾸는 심미 치료예요. 치아 삭제량은 케이스마다 달라질 수 있어요.',
  },
  {
    slug: 'whitening',
    name: '치아미백',
    aliases: ['치아미백', '미백'],
    topicSlug: 'laminate-whitening',
    definition:
      '치아미백은 약제로 치아 색을 밝게 하는 시술이에요. 시술 후 일시적 시림이 있을 수 있고, 착색 음식 관리가 필요합니다.',
  },
  {
    slug: 'sensitivity',
    name: '이시림',
    aliases: ['이시림', '시림', 'VSCs'],
    topicSlug: 'cavity',
    definition:
      '이시림은 찬물·단 음식에 치아가 찌릿하게 반응하는 증상이에요. 충치·잇몸 노출·크랙 등 원인이 여러 가지일 수 있습니다.',
  },
  {
    slug: 'halitosis',
    name: '구취·입냄새',
    aliases: ['입냄새', '구취', '입안헐음'],
    topicSlug: 'gum-prevention',
    definition:
      '구취(입냄새)는 구강 내 세균·치주 질환·건조 등으로 생기는 경우가 많아요. 원인 찾는 검진이 첫 단계입니다.',
  },
  {
    slug: 'fluoride',
    name: '불소',
    aliases: ['불소', '불소치약', '무불소치약'],
    topicSlug: 'gum-prevention',
    definition:
      '불소는 법랑질을 강화해 충치 예방에 도움이 되는 성분이에요. 치약·도포 등 연령에 맞게 쓰시면 좋아요.',
  },
  {
    slug: 'bruxism',
    name: '이갈이',
    aliases: ['이갈이', '브럭시즘'],
    topicSlug: 'gum-prevention',
    definition:
      '이갈이는 자거나 낮에 이를 세게 맞무는 습관이에요. 치아 마모·턱관절 통증·잇몸 불편을 유발할 수 있습니다.',
  },
  {
    slug: 'orthodontics',
    name: '치아교정',
    aliases: ['치아교정', '교정', '투명교정', '인비절라인'],
    topicSlug: 'laminate-whitening',
    definition:
      '치아교정은 덧니·부정교합을 교정 장치로 개선하는 치료예요. 방식·기간·비용은 케이스마다 달라질 수 있어요.',
  },
  {
    slug: 'extraction',
    name: '발치',
    aliases: ['발치', '발치교정'],
    topicSlug: 'wisdom-tooth',
    definition:
      '발치는 더 이상 살리기 어렵거나 다른 치료를 위해 치아를 빼는 처치예요. 매복·염증 여부에 따라 난이도가 달라집니다.',
  },
  {
    slug: 'prosthesis',
    name: '보철',
    aliases: ['보철', '보철치료'],
    topicSlug: 'crown-inlay',
    definition:
      '보철은 상실·손상된 치아의 기능과 모양을 되돌리는 치료의 총칭이에요. 크라운·브릿지·임플란트·틀니 등이 포함됩니다.',
  },
  {
    slug: 'bridge',
    name: '브릿지',
    aliases: ['브릿지'],
    topicSlug: 'crown-inlay',
    definition:
      '브릿지는 빠진 치아 자리를 양옆 치아에 고정된 인공치로 메우는 보철이에요. 지대치 준비(삭제)가 필요한 경우가 있습니다.',
  },
  {
    slug: 'sedation',
    name: '수면치과·의식하진정',
    aliases: ['수면치과', '의식하진정', '웃음가스'],
    topicSlug: 'implant',
    definition:
      '의식하진정·수면치과는 치과 공포가 있는 분을 편안한 상태에서 치료받게 돕는 방법이에요. 전신 상태에 따라 적합 여부를 판단합니다.',
  },
  {
    slug: 'primary-tooth',
    name: '유치',
    aliases: ['유치', '유치부러짐', '유치깨짐', '유치발치', '유치관'],
    topicSlug: 'gum-prevention',
    definition:
      '유치는 어릴 때 나는 임시 치아예요. 영구치가 나올 때까지 씹기·발음·공간 유지 역할을 합니다. 너무 일찍 빠지면 영구치 배열에 영향을 줄 수 있어요.',
  },
  {
    slug: 'cracked-tooth',
    name: '치아 크랙',
    aliases: ['치아크랙', '치아균열', '금간치아', '크랙'],
    topicSlug: 'cavity',
    definition:
      '치아 크랙은 치아에 생긴 미세한 금이나 균열이에요. 이갈이·단단한 음식·외상 등이 원인일 수 있고, 찬물 시림·씹을 때 통증으로 나타나기도 해요.',
  },
  {
    slug: 'apical-periodontitis',
    name: '치근단염',
    aliases: ['치근단염증', '치근단농양', '치근단'],
    topicSlug: 'cavity',
    definition:
      '치근단염은 치아 뿌리 끝(치근단) 주변에 염증이 생긴 상태예요. 신경치료가 필요하거나, 이미 치료한 치아에서 재발할 수도 있습니다.',
  },
  {
    slug: 'conservative-dentistry',
    name: '보존치료',
    aliases: ['보존치료', '치아살리기'],
    topicSlug: 'cavity',
    definition:
      '보존치료는 치아를 빼지 않고 살리는 치료의 총칭이에요. 레진·인레이·신경치료·크라운 등 범위에 맞는 방법을 고르는 경우가 많습니다.',
  },
  {
    slug: 'sealant',
    name: '실란트',
    aliases: ['실란트', '치아실란트', '불소실란트'],
    topicSlug: 'gum-prevention',
    definition:
      '실랜트는 어금니 홈·틈에 얇은 보호막을 바르는 예방 처치예요. 음식 찌꺼기가 끼기 쉬운 부위의 충치 예방에 도움이 될 수 있습니다.',
  },
  {
    slug: 'splint',
    name: '스플린트',
    aliases: ['스플린트', '나이트가드', '교합안정장치'],
    topicSlug: 'gum-prevention',
    definition:
      '스플린트는 이갈이·이악물기로 치아·턱관절을 보호하는 맞춤 장치예요. 주로 잠잘 때 착용하는 나이트가드 형태가 흔합니다.',
  },
  {
    slug: 'floss',
    name: '치실',
    aliases: ['치실', '바스법', '치간칫솔', '치간관리'],
    topicSlug: 'gum-prevention',
    definition:
      '치실·바스법은 칫솔이 닿지 않는 치아 사이를 닦는 방법이에요. 잇몸·충치 예방에 칫솔질만큼 중요한 경우가 많습니다.',
  },
  {
    slug: 'calculus',
    name: '치석',
    aliases: ['치석', '치태', '치아돌'],
    topicSlug: 'gum-prevention',
    definition:
      '치석은 입안 세균막(치태)이 굳어진 것이에요. 칫솔로는 잘 안 빠지고, 스케일링으로 제거하는 경우가 많습니다.',
  },
  {
    slug: 'denture',
    name: '틀니',
    aliases: ['틀니', '부분틀니', '완전틀니', '가철'],
    topicSlug: 'crown-inlay',
    definition:
      '틀니는 여러 치아를 한 번에 대체하는 탈착식 보철이에요. 임플란트·브릿지가 어려울 때 선택되는 경우가 있습니다.',
  },
  {
    slug: 'osseointegration',
    name: '골유착',
    aliases: ['골유착', '뼈유착', '골유착기간'],
    topicSlug: 'implant',
    definition:
      '골유착은 임플란트 픽스처가 주변 뼈와 단단히 붙는 과정이에요. 이 기간이 지나야 인공치를 연결하는 경우가 많습니다.',
  },
  {
    slug: 'impacted-tooth',
    name: '매복치',
    aliases: ['매복치', '매복사랑니', '수평매복', '반매복'],
    topicSlug: 'wisdom-tooth',
    definition:
      '매복치는 턱뼈·잇몸 안에 갇혀 제대로 나오지 못한 치아예요. 사랑니에서 흔하고, 발치 난이도가 높아질 수 있습니다.',
  },
  {
    slug: 'pericoronitis',
    name: '치관주위염',
    aliases: ['치관주위염', '사랑니잇몸', '사랑니잇몸통증', '사랑니잇몸부음'],
    topicSlug: 'wisdom-tooth',
    definition:
      '치관주위염은 부분적으로 난 치아(주로 사랑니) 주변 잇몸에 염증이 생기는 상태예요. 통증·부종·입 벌리기 어려움으로 나타날 수 있어요.',
  },
  {
    slug: 'tooth-fracture',
    name: '치아 파절',
    aliases: ['치아파절', '앞니부러짐', '앞니까매짐', '치아부러짐'],
    topicSlug: 'wisdom-tooth',
    definition:
      '치아 파절은 치아가 깨지거나 부러진 상태예요. 충격·이갈이·충치·크랙 등으로 생길 수 있고, 범위에 따라 치료가 달라집니다.',
  },
  {
    slug: 'local-anesthesia',
    name: '국소마취',
    aliases: ['국소마취', '무통마취', '치과마취'],
    topicSlug: 'implant',
    definition:
      '국소마취는 치료 부위만 잠시 감각을 없애는 마취예요. 발치·충치·임플란트 등 대부분의 치과 치료에서 쓰입니다.',
  },
  {
    slug: 'malocclusion',
    name: '부정교합',
    aliases: ['부정교합', '덧니', '벌어진치아', '무턱'],
    topicSlug: 'laminate-whitening',
    definition:
      '부정교합은 치아 배열·맞물림이 이상한 상태예요. 덧니·돌출·개방교합 등이 포함되고, 교정으로 개선하는 경우가 많습니다.',
  },
  {
    slug: 'tooth-discoloration',
    name: '치아 변색',
    aliases: ['치아변색', '변색', '누런이', '치아색'],
    topicSlug: 'laminate-whitening',
    definition:
      '치아 변색은 치아 색이 누렇거나 어두워진 상태예요. 착색 음식·흡연·노화·치료 재료 등 원인이 여러 가지일 수 있습니다.',
  },
  {
    slug: 'tooth-gem',
    name: '투스젬',
    aliases: ['투스젬', '투스젬제거', '치아보석'],
    topicSlug: 'laminate-whitening',
    definition:
      '투스젬은 치아 표면에 작은 장식(보석 등)을 붙이는 심미 시술이에요. 제거·재부착·치아 손상 여부는 케이스마다 달라질 수 있어요.',
  },
  {
    slug: 'occlusal-adjustment',
    name: '교합조정',
    aliases: ['교합조정', '교합', '물림조정'],
    topicSlug: 'crown-inlay',
    definition:
      '교합조정은 위·아래 치아가 맞물리는 높이·위치를 다듬는 처치예요. 보철·충치 치료 후 불편할 때 시행하는 경우가 많습니다.',
  },
  {
    slug: 'root-canal-re',
    name: '재신경치료',
    aliases: ['재신경치료', '근관재치료', '재근관치료'],
    topicSlug: 'cavity',
    definition:
      '재신경치료는 신경치료 후에도 통증·염증이 남거나 다시 생겼을 때, 근관을 다시 열어 소독·충전하는 치료예요.',
  },
  {
    slug: 'apicoectomy',
    name: '치근단절제술',
    aliases: ['치근단절제술', '근단수술', 'Apicoectomy'],
    topicSlug: 'cavity',
    definition:
      '치근단절제술은 신경치료만으로 잡히지 않는 치근단 염증을, 뿌리 끝을 수술로 제거해 해결하는 방법이에요.',
  },
  {
    slug: 'caries',
    name: '우식',
    aliases: ['우식', '우식증', '충치병'],
    topicSlug: 'cavity',
    definition:
      '우식은 치아가 산·세균에 의해 서서히 녹는 질환을 가리키는 의학 용어예요. 일상에서는 충치라고 부르는 경우가 많습니다.',
  },
  {
    slug: 'pulpotomy',
    name: '치수절단술',
    aliases: ['치수절단술', '치수절단', '소아신경치료'],
    topicSlug: 'cavity',
    definition:
      '치수절단술은 유치 등에서 염증이 있는 치수 일부만 제거하고 남은 치아를 보존하는 치료예요. 성인 신경치료와는 범위가 달라요.',
  },
  {
    slug: 'rubber-dam',
    name: '러버댐',
    aliases: ['러버댐', '방수막', '고무띠'],
    topicSlug: 'cavity',
    definition:
      '러버댐은 치료하는 치아만 따로 덮어 침·세균 유입을 줄이는 얇은 고무 막이에요. 충치·신경치료 때 자주 씁니다.',
  },
  {
    slug: 'gbr',
    name: 'GBR',
    aliases: ['GBR', '골유도재생술', '골재생술', '차단막'],
    topicSlug: 'implant',
    definition:
      'GBR(골유도재생술)은 임플란트·발치 자리 등에서 뼈가 부족할 때, 뼈 이식재와 막으로 공간을 만들어 뼈를 키우는 술식이에요.',
  },
  {
    slug: 'overdenture',
    name: '오버덴처',
    aliases: ['오버덴처', '임플란트틀니', '덴처오버임플란트'],
    topicSlug: 'crown-inlay',
    definition:
      '오버덴처는 임플란트 몇 개에 틀니를 끼워 고정하는 방식이에요. 틀니 흔들림을 줄이면서 수술 부담을 조절할 수 있습니다.',
  },
  {
    slug: 'immediate-implant',
    name: '즉시임플란트',
    aliases: ['즉시임플란트', '발치즉시임플란트', '즉시식립'],
    topicSlug: 'implant',
    definition:
      '즉시임플란트는 발치한 당일 같은 자리에 임플란트를 심는 방법이에요. 뼈·감염 상태에 따라 가능 여부가 달라집니다.',
  },
  {
    slug: 'invisalign',
    name: '인비절라인',
    aliases: ['인비절라인', 'Invisalign', '투명교정장치'],
    topicSlug: 'laminate-whitening',
    definition:
      '인비절라인은 투명한 맞춤 장치로 치아를 교정하는 방법이에요. 브라켓 없이 교정하는 대표적인 선택지 중 하나입니다.',
  },
  {
    slug: 'retainer',
    name: '유지장치',
    aliases: ['유지장치', '리테이너', '교정유지장치'],
    topicSlug: 'laminate-whitening',
    definition:
      '유지장치(리테이너)는 교정이 끝난 뒤 치아가 원래 자리로 돌아가지 않게 잡아 주는 장치예요. 착용 기간을 지키는 게 중요합니다.',
  },
  {
    slug: 'cerec',
    name: '세렉',
    aliases: ['세렉', 'CEREC', 'CAD/CAM', '캐드캠', '당일보철'],
    topicSlug: 'crown-inlay',
    definition:
      '세렉(CEREC)은 구강 스캔·CAD/CAM으로 인레이·크라운 등을 당일 또는 단기간에 제작하는 디지털 보철 방식이에요.',
  },
  {
    slug: 'pfm',
    name: 'PFM',
    aliases: ['PFM', '금속도재크라운', 'PFM크라운', '도재크라운'],
    topicSlug: 'crown-inlay',
    definition:
      'PFM(금속-도재 크라운)은 금속 뼈대 위에 도자기를 씌운 크라운이에요. 강도와 심미 사이 균형을 맞출 때 쓰였던 재료입니다.',
  },
  {
    slug: 'gold-inlay',
    name: '금인레이',
    aliases: ['금인레이', '골드인레이', '금'],
    topicSlug: 'crown-inlay',
    definition:
      '금인레이는 금 합금으로 만든 인레이예요. 강도·마모·생체 친화성이 좋은 편이라 어금니에 쓰이던 경우가 많습니다.',
  },
  {
    slug: 'nitrous-oxide',
    name: '웃음가스',
    aliases: ['웃음가스', '아산화질소', 'N2O'],
    topicSlug: 'implant',
    definition:
      '웃음가스(아산화질소)는 마스크로 흡입해 긴장·불안을 줄이는 가벼운 진정 방법이에요. 치과 공포가 있는 분에게 쓰이기도 합니다.',
  },
  {
    slug: 'periodontal-pocket',
    name: '치주낭',
    aliases: ['치주낭', '치주포켓', '잇몸주머니'],
    topicSlug: 'gum-prevention',
    definition:
      '치주낭은 치아와 잇몸 사이 공간이 비정상적으로 깊어진 상태예요. 치석·치주염 진행의 중요한 지표가 됩니다.',
  },
  {
    slug: 'scaling-root-planing',
    name: '치근활택술',
    aliases: ['치근활택술', 'SRP', '치근활택', '잇몸깊은스케일링'],
    topicSlug: 'gum-prevention',
    definition:
      '치근활택술은 치주염이 있을 때 잇몸 주머니 속 치석을 제거하고 치근 표면을 다듬는 치료예요. 일반 스케일링보다 깊은 단계입니다.',
  },
  {
    slug: 'gum-graft',
    name: '잇몸이식',
    aliases: ['잇몸이식', '치은이식', '치은이식술'],
    topicSlug: 'gum-prevention',
    definition:
      '잇몸이식은 잇몸이 얇거나 내려간 부위에 조직을 이식해 덮는 수술이에요. 뿌리 노출·시림·심미 개선 목적으로 시행됩니다.',
  },
  {
    slug: 'tmd',
    name: '턱관절장애',
    aliases: ['턱관절장애', 'TMD', '턱관절', '턱통증'],
    topicSlug: 'gum-prevention',
    definition:
      '턱관절장애(TMD)는 턱관절·주변 근육에 통증·소리·개구 제한 등이 생기는 상태예요. 이갈이·스트레스·교합 문제와 연관될 수 있습니다.',
  },
  {
    slug: 'permanent-tooth',
    name: '영구치',
    aliases: ['영구치', '성인치', '큰치아'],
    topicSlug: 'gum-prevention',
    definition:
      '영구치는 유치 다음에 나와 평생 쓰는 치아예요. 보통 6~7세부터 순차적으로 맹출하고, 관리가 평생 필요합니다.',
  },
  {
    slug: 'supernumerary',
    name: '과잉치',
    aliases: ['과잉치', '여분치아', '다생치'],
    topicSlug: 'wisdom-tooth',
    definition:
      '과잉치는 정상 개수보다 하나 더 난 치아예요. 배열·맹출을 방해하거나 발치가 필요한 경우가 있습니다.',
  },
  {
    slug: 'molar',
    name: '어금니',
    aliases: ['어금니', '구치', '대구치'],
    topicSlug: 'cavity',
    definition:
      '어금니(구치)는 입 안쪽에서 음식을 가장 많이 씹는 큰 치아예요. 홈이 깊어 충치·치주 질환에 취약한 편입니다.',
  },
  {
    slug: 'pediatric-dentistry',
    name: '소아치과',
    aliases: ['소아치과', '어린이치과', '소아치과치료'],
    topicSlug: 'gum-prevention',
    definition:
      '소아치과는 어린이 구강·치아를 전문으로 다루는 진료 분야예요. 유치·영구치 관리, 충치 예방, 습관 교정 등을 포함합니다.',
  },
  {
    slug: 'dental-checkup',
    name: '정기검진',
    aliases: ['정기검진', '치과검진', '구강검진', '정기검진주기'],
    topicSlug: 'gum-prevention',
    definition:
      '정기검진은 증상이 없어도 치아·잇몸 상태를 확인하는 검진이에요. 작은 충치·잇몸 염증을 일찍 찾는 데 도움이 됩니다.',
  },
  {
    slug: 'all-on-4',
    name: 'All-on-4',
    aliases: ['All-on-4', '올온포', '전체임플란트', '무치악임플란트'],
    topicSlug: 'implant',
    definition:
      'All-on-4는 임플란트 4개 정도로 턱 전체 치아를 고정하는 전체 임플란트 치료 개념이에요. 무치악·틀니가 불편한 분에게 논의됩니다.',
  },
  {
    slug: 'post-core',
    name: '포스트',
    aliases: ['포스트', '포스트코어', '치아기둥', '근관주'],
    topicSlug: 'crown-inlay',
    definition:
      '포스트(포스트 코어)는 신경치료한 치아에 크라운을 받치기 위해 근관 안에 세우는 기둥 구조예요. 치아가 많이 약했을 때 씁니다.',
  },
];


