/**
 * 원인별 치료 블록 — "그래서 뭘 하면 되는데?"에 답하는 자리.
 *
 * 사전 본문은 원인을 설명하고 끝나는 경우가 많았다. 치료법이 있어도
 * 산문 속에 흩어져 있어 환자가 자기 경우를 못 찾았다.
 * 여기서는 원인 한 줄 → 치료명(한글·영문) → 기간·횟수까지 못박는다.
 *
 * 규칙
 *   when   환자가 자기 얘기인지 3초 안에 알아볼 수 있게 쓴다
 *   name   실제 진료실에서 쓰는 술식명. "수술" 같은 뭉뚱그린 말 금지
 *   en     검색·인용용 영문 술식명. 대응어가 없으면 비운다
 *   detail 무엇을 하는지 + 기간이나 횟수. 숫자 없이 끝내지 않는다
 *
 * 해부·구조 용어(백악질, 치근관…)에는 넣지 않는다. 치료 대상이 아니다.
 */
export interface TermApproach {
  /** 어떤 경우에 해당하는지 */
  when: string;
  /** 치료·대응 이름 (한글) */
  name: string;
  /** 영문 술식명 */
  en?: string;
  /** 무엇을 하는지 + 기간·횟수 */
  detail: string;
}

export const termApproaches: Record<string, TermApproach[]> = {
  geomiseumail: [
    {
      when: '잇몸이 치아를 덮어 치아가 짧아 보이는 경우',
      name: '치관 연장술',
      en: 'Crown Lengthening',
      detail: '잇몸과 필요하면 치조골까지 다듬어 치아를 2~4mm 더 드러냅니다. 수술은 1회, 잇몸이 자리 잡는 데 6~8주.',
    },
    {
      when: '앞니가 아래로 처져 잇몸이 드러나는 경우',
      name: '미니스크류 함입 교정',
      en: 'Miniscrew Intrusion',
      detail: '잇몸뼈에 심은 미니스크류를 지지대로 앞니를 2~3mm 밀어 넣습니다. 6~12개월.',
    },
    {
      when: '위턱뼈가 세로로 길어 생긴 골격성',
      name: '르포트 I 상악 골절단술',
      en: 'Le Fort I Osteotomy',
      detail: '위턱뼈를 수평으로 잘라 위로 올려 고정합니다. 전신마취 수술이고 교정을 함께해 전체 18~24개월.',
    },
    {
      when: '윗입술이 과하게 올라가는 경우',
      name: '보툴리눔 톡신 / 입술 재위치술',
      en: 'Botulinum Toxin / Lip Repositioning',
      detail: '톡신은 윗입술 올림근을 약화시키며 3~4개월마다 반복합니다. 지속을 원하면 입술 재위치술을 검토합니다.',
    },
  ],

  gingivitis: [
    {
      when: '거의 모든 치은염의 1차 치료',
      name: '스케일링 + 잇몸 위 치석 제거',
      en: 'Supragingival Scaling',
      detail: '치석과 치태를 걷어냅니다. 1회 20~40분이면 끝나고, 잇몸 붉기와 출혈은 보통 1~2주 안에 가라앉습니다.',
    },
    {
      when: '칫솔질로 닿지 않는 부위가 반복해 붓는 경우',
      name: '구강위생 재교육 + 치간 관리',
      en: 'Oral Hygiene Instruction',
      detail: '바스법 칫솔질에 치실이나 치간칫솔을 더합니다. 치은염은 치태만 걷히면 원래 잇몸으로 돌아옵니다.',
    },
    {
      when: '보철물이나 충전물 가장자리가 원인인 경우',
      name: '보철물 변연 수정 또는 재제작',
      en: 'Margin Correction',
      detail: '치태가 끼는 턱을 없앱니다. 다듬어 되는 경우도 있고 다시 만들어야 하는 경우도 있습니다.',
    },
  ],

  periodontitis: [
    {
      when: '치주낭 4~5mm, 초기',
      name: '치근활택술 (SRP)',
      en: 'Scaling and Root Planing',
      detail: '마취하고 잇몸 속 치근 표면의 치석과 오염층을 긁어냅니다. 보통 상하좌우 나눠 2~4회, 4~6주 뒤 재평가.',
    },
    {
      when: 'SRP 후에도 치주낭 6mm 이상 남은 경우',
      name: '치주 판막 수술',
      en: 'Periodontal Flap Surgery',
      detail: '잇몸을 젖혀 직접 보면서 염증 조직과 치석을 제거하고 봉합합니다. 부위당 1회, 실밥은 1~2주 뒤.',
    },
    {
      when: '골 결손이 국소적으로 깊게 파인 경우',
      name: '치주 조직 재생술',
      en: 'Guided Tissue Regeneration',
      detail: '골이식재와 차단막으로 없어진 뼈가 다시 차오를 공간을 만듭니다. 재생 판정까지 6~9개월.',
    },
    {
      when: '치료를 마친 뒤 평생',
      name: '치주 유지관리',
      en: 'Periodontal Maintenance',
      detail: '3~4개월 간격 정기 관리로 재발을 막습니다. 치주염은 완치가 아니라 관리하는 병입니다.',
    },
  ],

  sensitivity: [
    {
      when: '가벼운 시림, 원인이 뚜렷하지 않을 때',
      name: '지각과민 완화 치약',
      en: 'Desensitizing Toothpaste',
      detail: '질산칼륨이나 불화주석이 든 치약을 2~4주 꾸준히 씁니다. 헹군 뒤 소량을 시린 부위에 문질러두면 더 낫습니다.',
    },
    {
      when: '특정 치아가 콕 집어 시릴 때',
      name: '지각과민 처치제 도포',
      en: 'Desensitizer Application',
      detail: '노출된 상아세관을 약제로 막습니다. 1회 5~10분, 효과는 수개월 가고 필요하면 반복합니다.',
    },
    {
      when: '치경부가 V자로 패인 경우',
      name: '치경부 레진 충전',
      en: 'Cervical Composite Restoration',
      detail: '패인 곳을 레진으로 메워 상아질을 덮습니다. 1회 방문, 마취는 대개 필요 없습니다.',
    },
    {
      when: '잇몸이 내려가 치근이 드러난 경우',
      name: '치근 피개술',
      en: 'Root Coverage Graft',
      detail: '입천장에서 떼어낸 결합조직으로 드러난 치근을 덮습니다. 1회 수술, 안정까지 2~3개월.',
    },
    {
      when: '시림이 아니라 지속되는 통증으로 바뀐 경우',
      name: '신경치료',
      en: 'Root Canal Treatment',
      detail: '치수 염증이 되돌릴 수 없는 단계면 시림 치료로 해결되지 않습니다. 2~4회 방문.',
    },
  ],

  'dry-socket': [
    {
      when: '발치 후 3~5일에 통증이 다시 심해질 때',
      name: '소켓 세척 + 진통 드레싱',
      en: 'Socket Irrigation and Medicated Dressing',
      detail: '식염수로 씻어내고 유지놀 거즈를 채웁니다. 넣는 즉시 통증이 크게 줄고, 1~3일 간격으로 2~4회 교체합니다.',
    },
    {
      when: '드레싱 기간 중',
      name: '진통제 병용',
      en: 'Analgesics',
      detail: '이부프로펜 계열을 함께 씁니다. 항생제는 감염이 확인된 경우가 아니면 쓰지 않습니다.',
    },
    {
      when: '치유 경과',
      name: '자연 치유 대기',
      en: 'Secondary Healing',
      detail: '새 육아조직이 차오르며 7~10일이면 통증이 사라집니다. 뼈가 상하는 것은 아닙니다.',
    },
  ],

  'cracked-tooth': [
    {
      when: '금이 법랑질에만 있고 증상이 없을 때',
      name: '경과 관찰 + 교합 조정',
      en: 'Monitoring and Occlusal Adjustment',
      detail: '금 간 곳에 힘이 몰리지 않게 교합을 다듬고 6개월마다 봅니다. 이갈이가 있으면 장치를 함께 씁니다.',
    },
    {
      when: '씹을 때 시큰하고 뗄 때 통증이 있을 때',
      name: '전장관 수복 (크라운)',
      en: 'Full Coverage Crown',
      detail: '치아를 감싸 벌어지는 힘을 묶습니다. 크랙 치아의 표준 처치이고 2~3회 방문.',
    },
    {
      when: '금이 치수까지 닿아 가만히 있어도 아플 때',
      name: '신경치료 후 크라운',
      en: 'Root Canal Treatment then Crown',
      detail: '신경치료로 통증을 없앤 뒤 반드시 크라운으로 덮습니다. 총 3~5회 방문.',
    },
    {
      when: '금이 치근까지 세로로 내려간 경우',
      name: '발치',
      en: 'Extraction',
      detail: '치근 파절은 붙지 않습니다. 뽑고 임플란트나 브릿지로 갑니다. 이 경우만큼은 살리는 방법이 없습니다.',
    },
  ],

  'chigyeongbu-mamojeung': [
    {
      when: '패임이 얕고 시리지 않을 때',
      name: '원인 제거 + 관찰',
      en: 'Cause Control',
      detail: '옆으로 세게 문지르는 칫솔질을 바스법으로 바꾸고 단단한 칫솔모를 부드러운 것으로 바꿉니다.',
    },
    {
      when: '시리거나 패임이 깊어질 때',
      name: '치경부 레진 충전',
      en: 'Cervical Composite Restoration',
      detail: '패인 부위를 레진으로 메웁니다. 1회 방문, 20~30분.',
    },
    {
      when: '이갈이·이악물기로 계속 재발할 때',
      name: '교합 조정 + 야간 장치',
      en: 'Occlusal Adjustment and Night Guard',
      detail: '치경부에 힘이 몰리는 교합을 다듬고 나이트가드를 씁니다. 원인을 두면 때워도 또 떨어집니다.',
    },
  ],

  'chieun-toechug': [
    {
      when: '내려간 정도가 작고 시림도 없을 때',
      name: '칫솔질 교정 + 경과 관찰',
      en: 'Brushing Modification',
      detail: '과도한 압력과 옆쓸기 칫솔질을 바꿉니다. 이미 내려간 잇몸은 저절로 올라오지 않지만 더 내려가는 것은 막습니다.',
    },
    {
      when: '치근이 드러나 시리거나 보기 싫을 때',
      name: '치근 피개술',
      en: 'Root Coverage Graft',
      detail: '입천장 결합조직을 이식해 덮습니다. 1회 수술, 성공하면 2~4mm 회복. 안정까지 2~3개월.',
    },
    {
      when: '치아 위치가 잇몸 바깥으로 밀려나 생긴 경우',
      name: '교정으로 치아 위치 이동',
      en: 'Orthodontic Repositioning',
      detail: '치아를 잇몸뼈 안쪽으로 되돌린 뒤 필요하면 이식을 더합니다. 순서가 반대면 재발합니다.',
    },
  ],

  'chigan-igae': [
    {
      when: '벌어진 틈이 좁고 치아 크기는 정상일 때',
      name: '레진 수복',
      en: 'Composite Bonding',
      detail: '양쪽 치아 옆면에 레진을 덧대 틈을 메웁니다. 1회 방문, 삭제가 거의 없습니다.',
    },
    {
      when: '틈이 넓거나 여러 군데일 때',
      name: '교정 치료',
      en: 'Orthodontic Closure',
      detail: '치아를 실제로 모읍니다. 부분 교정은 6~12개월, 전체 교정은 18~30개월.',
    },
    {
      when: '치아 자체가 작아서 생긴 틈일 때',
      name: '라미네이트',
      en: 'Laminate Veneer',
      detail: '앞면을 얇게 덮어 폭을 넓힙니다. 2~3회 방문.',
    },
    {
      when: '윗입술 소대가 두꺼워 앞니 사이를 벌리는 경우',
      name: '상순 소대 절제술',
      en: 'Labial Frenectomy',
      detail: '소대를 정리한 뒤 교정으로 모읍니다. 소대를 두면 모아도 다시 벌어집니다.',
    },
  ],

  guganggeonjojeung: [
    {
      when: '먹는 약이 원인일 때',
      name: '처방 조정 상담',
      en: 'Medication Review',
      detail: '항히스타민·항우울제·이뇨제가 흔한 원인입니다. 처방의와 대체 약을 상의합니다. 임의 중단은 안 됩니다.',
    },
    {
      when: '침샘 기능이 남아 있을 때',
      name: '타액 분비 촉진제',
      en: 'Sialogogues',
      detail: '필로카르핀이나 세비멜린을 씁니다. 무설탕 껌을 하루 4~6회 씹는 것도 실제로 도움이 됩니다.',
    },
    {
      when: '분비 자체가 어려울 때',
      name: '인공 타액 · 보습제',
      en: 'Saliva Substitutes',
      detail: '겔이나 스프레이로 점막을 덮습니다. 특히 자기 전에 씁니다.',
    },
    {
      when: '구강건조가 오래된 모든 환자',
      name: '고농도 불소 도포',
      en: 'High-Fluoride Application',
      detail: '침이 줄면 뿌리 우식이 빠르게 옵니다. 5,000ppm 불소치약과 3~4개월 간격 검진을 함께합니다.',
    },
  ],

  'jaebalseong-apeuta-gunaeyeom': [
    {
      when: '작은 궤양이 한두 개일 때',
      name: '국소 스테로이드 연고',
      en: 'Topical Corticosteroid',
      detail: '트리암시놀론 구강용 연고를 하루 2~3회 바릅니다. 통증이 빨리 줄고 7~10일이면 아뭅니다.',
    },
    {
      when: '통증으로 먹기 힘들 때',
      name: '국소 마취 가글 · 점막 보호제',
      en: 'Topical Anesthetic Rinse',
      detail: '식사 직전에 헹궈 통증을 줄입니다. 치료가 아니라 버티게 해주는 처치입니다.',
    },
    {
      when: '크기 1cm 이상이거나 6주 넘게 안 아물 때',
      name: '조직검사',
      en: 'Biopsy',
      detail: '아프타는 2주 안에 아뭅니다. 그보다 오래가면 다른 병을 감별해야 합니다.',
    },
    {
      when: '자주 반복될 때',
      name: '유발 요인 점검',
      en: 'Trigger Assessment',
      detail: '철·엽산·비타민 B12 부족, 베체트병, SLS 함유 치약을 확인합니다.',
    },
  ],

  pericoronitis: [
    {
      when: '급성으로 붓고 아플 때',
      name: '세척 + 항생제',
      en: 'Irrigation and Antibiotics',
      detail: '잇몸 덮개 아래를 씻어내고 감염이 퍼졌으면 항생제를 씁니다. 급성기는 3~5일이면 가라앉습니다.',
    },
    {
      when: '고름집이 잡혔을 때',
      name: '절개 배농',
      en: 'Incision and Drainage',
      detail: '째서 고름을 빼냅니다. 붓기와 통증이 즉시 줄어듭니다.',
    },
    {
      when: '가라앉은 뒤 근본 처치',
      name: '사랑니 발치',
      en: 'Wisdom Tooth Extraction',
      detail: '덮개가 남아 있으면 반복됩니다. 급성기를 넘긴 1~2주 뒤에 뽑는 것이 표준입니다.',
    },
    {
      when: '사랑니를 살려야 하는 드문 경우',
      name: '치은판 절제술',
      en: 'Operculectomy',
      detail: '덮인 잇몸만 잘라냅니다. 다시 덮이는 경우가 있어 발치보다 재발이 잦습니다.',
    },
  ],

  'peri-implantitis': [
    {
      when: '잇몸만 붉고 뼈는 아직 녹지 않았을 때 (주위 점막염)',
      name: '비수술적 청결 처치',
      en: 'Non-surgical Debridement',
      detail: '티타늄에 상처를 내지 않는 기구와 세척으로 오염을 걷어냅니다. 이 단계면 되돌릴 수 있습니다.',
    },
    {
      when: '뼈가 녹기 시작했을 때',
      name: '판막 수술 + 임플란트 표면 정화',
      en: 'Flap Surgery with Implant Surface Decontamination',
      detail: '잇몸을 젖혀 나사산에 붙은 오염을 직접 제거합니다. 1회 수술, 회복 2~4주.',
    },
    {
      when: '결손이 깊고 임플란트가 아직 흔들리지 않을 때',
      name: '골재생술 병행',
      en: 'Regenerative Therapy',
      detail: '골이식재와 차단막으로 뼈를 되살립니다. 재평가까지 6~9개월.',
    },
    {
      when: '임플란트가 흔들릴 때',
      name: '임플란트 제거',
      en: 'Implant Removal',
      detail: '골유착이 깨지면 살릴 수 없습니다. 제거 후 뼈를 만들고 3~6개월 뒤 재식립을 검토합니다.',
    },
  ],

  halitosis: [
    {
      when: '혀 뒤쪽 백태가 원인일 때 (가장 흔함)',
      name: '혀 클리닝',
      en: 'Tongue Cleaning',
      detail: '혀클리너로 안쪽에서 바깥으로 하루 1회 훑습니다. 구취 원인의 절반 이상이 여기서 나옵니다.',
    },
    {
      when: '잇몸병이 있을 때',
      name: '스케일링 · 치주 치료',
      en: 'Periodontal Therapy',
      detail: '치주낭 속 세균이 휘발성 황화합물을 만듭니다. 잇몸을 잡으면 냄새가 함께 줄어듭니다.',
    },
    {
      when: '충치·틈새 보철이 있을 때',
      name: '우식 치료 · 보철 재제작',
      en: 'Restorative Treatment',
      detail: '음식물이 끼어 썩는 자리를 없앱니다.',
    },
    {
      when: '입이 마를 때',
      name: '구강건조 관리',
      en: 'Dry Mouth Management',
      detail: '침이 줄면 냄새가 짙어집니다. 수분 섭취와 무설탕 껌을 병행합니다.',
    },
    {
      when: '위 처치로 해결되지 않을 때',
      name: '이비인후과·내과 의뢰',
      en: 'Medical Referral',
      detail: '편도결석, 부비동염, 역류성 식도염이 원인일 수 있습니다. 구취의 약 10%는 구강 밖 원인입니다.',
    },
  ],

  tmd: [
    {
      when: '거의 모든 초기 턱관절장애',
      name: '보존 치료',
      en: 'Conservative Therapy',
      detail: '딱딱하고 질긴 음식과 큰 입 벌리기를 피하고 온찜질을 합니다. 상당수가 2~4주 안에 좋아집니다.',
    },
    {
      when: '이갈이·이악물기가 겹칠 때',
      name: '교합안정장치 (스플린트)',
      en: 'Occlusal Stabilization Splint',
      detail: '잘 때 끼워 관절과 근육 부담을 덜어냅니다. 제작 2~3회 방문, 착용 3~6개월 뒤 재평가.',
    },
    {
      when: '근육 통증이 주된 경우',
      name: '물리치료 + 자가운동',
      en: 'Physical Therapy',
      detail: '개구 훈련과 근육 이완을 병행합니다. 하루 2~3회, 4주 이상 해야 효과가 나옵니다.',
    },
    {
      when: '통증이 심하거나 급성일 때',
      name: '약물 치료',
      en: 'Pharmacotherapy',
      detail: 'NSAIDs와 근이완제를 단기간 씁니다. 오래 쓰는 약이 아닙니다.',
    },
    {
      when: '보존 치료에 반응하지 않는 관절 내 문제',
      name: '관절강 세척술 · 관절경',
      en: 'Arthrocentesis / Arthroscopy',
      detail: '관절강을 씻어내 유착과 염증물질을 제거합니다. 수술은 마지막 선택이고 실제로 가는 경우는 드뭅니다.',
    },
  ],

  'tooth-discoloration': [
    {
      when: '커피·담배 등 표면 착색',
      name: '스케일링 + 치면 연마',
      en: 'Scaling and Polishing',
      detail: '겉에 붙은 색소를 걷어냅니다. 1회 방문으로 상당 부분 돌아옵니다.',
    },
    {
      when: '치아 속까지 누렇게 변한 경우',
      name: '치아 미백',
      en: 'Tooth Whitening',
      detail: '전문가 미백은 1~3회, 자가 미백은 하루 1~2시간씩 2~4주. 둘을 병행하면 유지가 좋습니다.',
    },
    {
      when: '신경치료한 치아 하나만 어두울 때',
      name: '실활치 미백',
      en: 'Internal Bleaching',
      detail: '치아 안쪽에 약제를 넣고 1주 간격으로 2~4회 교체합니다. 겉에서 하는 미백으로는 잘 안 밝아집니다.',
    },
    {
      when: '테트라사이클린 착색이나 법랑질 형성 이상',
      name: '라미네이트 · 크라운',
      en: 'Veneer or Crown',
      detail: '미백으로 한계가 있는 색은 덮습니다. 2~3회 방문.',
    },
  ],

  malocclusion: [
    {
      when: '치아 배열만 문제인 경우',
      name: '고정식 교정 (브라켓)',
      en: 'Fixed Orthodontic Appliance',
      detail: '치아에 브라켓을 붙여 배열과 교합을 맞춥니다. 18~30개월.',
    },
    {
      when: '움직일 공간이 부족한 경우',
      name: '발치 교정',
      en: 'Extraction Orthodontics',
      detail: '작은어금니를 뽑아 공간을 만든 뒤 배열합니다. 24~30개월.',
    },
    {
      when: '성장기 아동의 골격 부조화',
      name: '기능적 교정 장치 · 확장 장치',
      en: 'Functional Appliance / Palatal Expander',
      detail: '성장 방향을 유도합니다. 시기를 놓치면 못 하는 치료라 6~12세에 판단합니다.',
    },
    {
      when: '성인의 골격성 부정교합',
      name: '악교정 수술 + 교정',
      en: 'Orthognathic Surgery',
      detail: '턱뼈 위치를 옮깁니다. 수술 전후 교정을 포함해 18~30개월.',
    },
    {
      when: '치료를 마친 뒤',
      name: '유지장치',
      en: 'Retainer',
      detail: '첫 1년은 거의 종일, 이후 야간에만. 안 끼면 되돌아갑니다.',
    },
  ],

  gunaeyeom: [
    {
      when: '바이러스성(단순포진 등)일 때',
      name: '항바이러스제 + 대증 치료',
      en: 'Antiviral Therapy',
      detail: '증상 시작 72시간 안에 쓰면 효과가 큽니다. 보통 7~14일이면 낫습니다.',
    },
    {
      when: '곰팡이(칸디다)일 때',
      name: '항진균제',
      en: 'Antifungal Therapy',
      detail: '나이스타틴 현탁액이나 플루코나졸을 씁니다. 틀니를 쓰면 틀니도 같이 소독합니다.',
    },
    {
      when: '외상·보철물 자극일 때',
      name: '자극 원인 제거',
      en: 'Removal of Irritant',
      detail: '날카로운 보철 가장자리를 다듬습니다. 원인을 없애면 1~2주에 아뭅니다.',
    },
    {
      when: '2주 넘게 낫지 않을 때',
      name: '조직검사',
      en: 'Biopsy',
      detail: '구내염은 대부분 2주 안에 아뭅니다. 그 이상이면 반드시 감별합니다.',
    },
  ],
};

/** 치료 블록이 있는 용어인지 */
export function hasApproach(slug: string): boolean {
  return Boolean(termApproaches[slug]?.length);
}
