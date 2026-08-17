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
 * 순서는 실제로 흔한 순이다. 화면에 1·2·3으로 번호가 붙으므로
 * 배열 순서가 곧 "얼마나 자주 하는 치료인가"로 읽힌다.
 * 드문 술식을 위에 두면 환자가 자기 경우를 과대평가한다.
 * 예) 거미스마일에서 골절단술·함입교정은 톡신·입술재위치술보다 훨씬 드물다.
 * 단계가 정해진 치료(치주염의 SRP→판막→재생)는 진행 순서가 곧 빈도 순이다.
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
  /**
   * 연결할 사전 페이지 슬러그를 직접 지정한다.
   * 보통은 술식명이 표제어와 정확히 같으면 자동으로 연결되지만,
   * "입술 재위치술 (변형 전정성형술)"처럼 이름이 표제어와 어긋나면 여기에 적는다.
   */
  slug?: string;
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
      when: '윗입술이 과하게 올라가는 경우, 우선 시도',
      name: '보툴리눔 톡신',
      en: 'Botulinum Toxin',
      detail: '윗입술 올림근에 소량 주사해 올라가는 정도를 줄입니다. 시술 5~10분, 2주쯤 뒤 효과가 나오고 3~4개월마다 반복합니다.',
    },
    {
      when: '입술 원인인데 반복 주사 대신 오래가는 방법을 원할 때',
      name: '입술 재위치술 (변형 전정성형술)',
      en: 'Lip Repositioning (Modified Vestibuloplasty)',
      slug: 'vestibuloplasty',
      detail: '윗입술 안쪽 전정 점막을 띠 모양으로 떼어내고 낮은 위치에 봉합해 입술이 덜 올라가게 합니다. 1회 수술, 실밥 2주, 노출 3~5mm 감소.',
    },
    {
      when: '앞니가 아래로 처져 잇몸이 드러나는 경우',
      name: '미니스크류 함입 교정',
      en: 'Miniscrew Intrusion',
      detail: '잇몸뼈에 심은 미니스크류를 지지대로 앞니를 2~3mm 밀어 넣습니다. 6~12개월.',
    },
    {
      when: '위턱뼈가 세로로 길어 생긴 골격성 (가장 드묾)',
      name: '르포트 I 상악 골절단술',
      en: 'Le Fort I Osteotomy',
      detail: '위턱뼈를 수평으로 잘라 위로 올려 고정합니다. 전신마취 수술이고 교정을 함께해 전체 18~24개월.',
    },
  ],

  vestibuloplasty: [
    {
      when: '전정이 얕아 아래 틀니가 자꾸 빠질 때 (가장 흔한 이유)',
      name: '점막하 전정성형술',
      en: 'Submucosal Vestibuloplasty',
      detail: '점막은 남기고 그 아래 근육 부착만 아래로 옮깁니다. 상처가 겉으로 안 드러나 회복이 빠르고, 실밥 1~2주.',
    },
    {
      when: '점막이 부족해 그냥 젖히면 다시 올라올 때',
      name: '유리 이식 전정성형술',
      en: 'Free Graft Vestibuloplasty',
      detail: '입천장 점막이나 피부를 떼어 노출면에 이식해 고정합니다. 재발이 적은 대신 이식 부위가 2~3주 불편합니다.',
    },
    {
      when: '임플란트 주위에 움직이지 않는 잇몸이 부족할 때',
      name: '각화 치은 증대술',
      en: 'Keratinized Tissue Augmentation',
      detail: '임플란트 둘레에 단단한 잇몸을 2mm 이상 만들어 줍니다. 칫솔질이 쉬워져 주위염 위험이 줄어듭니다.',
    },
    {
      when: '거미스마일에서 입술이 과하게 올라갈 때 (응용)',
      name: '입술 재위치술',
      en: 'Lip Repositioning',
      detail: '같은 전정 접근으로 점막을 띠 모양으로 떼어내 낮게 봉합합니다. 잇몸 노출이 3~5mm 줄어듭니다.',
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
      when: '증상을 바로 덜고 싶을 때',
      name: '인공 타액 · 보습제',
      en: 'Saliva Substitutes',
      detail: '겔이나 스프레이로 점막을 덮습니다. 특히 자기 전에 쓰고, 무설탕 껌을 하루 4~6회 씹는 것도 도움이 됩니다.',
    },
    {
      when: '구강건조가 오래된 모든 환자',
      name: '고농도 불소 도포',
      en: 'High-Fluoride Application',
      detail: '침이 줄면 뿌리 우식이 빠르게 옵니다. 5,000ppm 불소치약과 3~4개월 간격 검진을 함께합니다.',
    },
    {
      when: '위 방법으로 부족하고 침샘 기능이 남아 있을 때',
      name: '타액 분비 촉진제',
      en: 'Sialogogues',
      detail: '필로카르핀이나 세비멜린을 처방합니다. 땀·홍조 같은 부작용이 있어 흔히 쓰지는 않습니다.',
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
      when: '자주 반복될 때',
      name: '유발 요인 점검',
      en: 'Trigger Assessment',
      detail: '철·엽산·비타민 B12 부족, 베체트병, SLS 함유 치약을 확인합니다.',
    },
    {
      when: '크기 1cm 이상이거나 6주 넘게 안 아물 때 (드묾)',
      name: '조직검사',
      en: 'Biopsy',
      detail: '아프타는 2주 안에 아뭅니다. 그보다 오래가면 다른 병을 감별해야 합니다.',
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
      when: '가라앉은 뒤 근본 처치',
      name: '사랑니 발치',
      en: 'Wisdom Tooth Extraction',
      detail: '덮개가 남아 있으면 반복됩니다. 급성기를 넘긴 1~2주 뒤에 뽑는 것이 표준입니다.',
    },
    {
      when: '고름집이 잡혔을 때',
      name: '절개 배농',
      en: 'Incision and Drainage',
      detail: '째서 고름을 빼냅니다. 붓기와 통증이 즉시 줄어듭니다.',
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
      // 사전의 「보존치료」는 충치·신경치료 분야를 뜻해 글자가 같아도 다른 개념이다.
      // 자동 링크가 그쪽으로 걸리지 않도록 이름을 구분해 둔다.
      name: '비수술적 보존 요법',
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
      when: '통증이 심하거나 급성일 때',
      name: '약물 치료',
      en: 'Pharmacotherapy',
      detail: 'NSAIDs와 근이완제를 단기간 씁니다. 오래 쓰는 약이 아닙니다.',
    },
    {
      when: '근육 통증이 주된 경우',
      name: '물리치료 + 자가운동',
      en: 'Physical Therapy',
      detail: '개구 훈련과 근육 이완을 병행합니다. 하루 2~3회, 4주 이상 해야 효과가 나옵니다.',
    },
    {
      when: '보존 치료에 반응하지 않는 관절 내 문제 (드묾)',
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
      when: '깨물었거나 보철물이 쓸려서 생긴 경우 (가장 흔함)',
      name: '자극 원인 제거',
      en: 'Removal of Irritant',
      detail: '날카로운 보철 가장자리나 치아 모서리를 다듬습니다. 원인을 없애면 1~2주에 아뭅니다.',
    },
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
      when: '2주 넘게 낫지 않을 때',
      name: '조직검사',
      en: 'Biopsy',
      detail: '구내염은 대부분 2주 안에 아뭅니다. 그 이상이면 반드시 감별합니다.',
    },
  ],

  // ── 외상·응급 ────────────────────────────────────────────

  'chia-wanjeon-talgu': [
    {
      when: '영구치가 통째로 빠진 직후, 그 자리에서',
      name: '즉시 재식',
      en: 'Immediate Replantation',
      detail: '치아 머리만 잡고 뿌리는 만지지 않은 채 제자리에 도로 밀어 넣습니다. 30분 안에 넣을수록 살 확률이 높습니다.',
    },
    {
      when: '바로 넣기 어려울 때, 병원 가는 동안',
      name: '보관액에 담가 이동',
      en: 'Storage Medium Transport',
      detail: '우유나 생리식염수에 담급니다. 물이나 휴지는 안 됩니다 — 뿌리 표면 세포가 죽습니다. 60분 안에 도착이 목표입니다.',
    },
    {
      when: '치과 도착 후',
      name: '정복 + 유연 고정',
      en: 'Repositioning and Flexible Splinting',
      detail: '위치를 맞추고 옆 치아에 묶어 2주 고정합니다. 단단히 묶으면 오히려 뿌리가 뼈에 유착됩니다.',
    },
    {
      when: '재식한 영구치의 후속 처치',
      name: '신경치료',
      en: 'Root Canal Treatment',
      detail: '뿌리가 다 자란 치아는 신경이 살아남지 못합니다. 재식 7~10일 뒤 시작해 뿌리가 녹는 것을 막습니다.',
    },
    {
      when: '빠진 것이 유치일 때',
      name: '재식하지 않음',
      en: 'No Replantation',
      detail: '유치를 도로 넣으면 그 위에서 자라는 영구치싹을 다칩니다. 넣지 말고 공간 관리만 합니다.',
    },
  ],

  'chigwan-pajeol': [
    {
      when: '법랑질만 살짝 깨졌을 때',
      name: '연마 또는 레진 수복',
      en: 'Polishing or Composite Restoration',
      detail: '날카로운 모서리를 다듬거나 레진으로 모양을 살립니다. 1회 방문, 마취도 대개 필요 없습니다.',
    },
    {
      when: '상아질이 드러나 시릴 때',
      name: '이장 후 레진 수복',
      en: 'Liner and Composite Restoration',
      detail: '노출된 상아질을 약제로 덮고 레진을 올립니다. 24시간 안에 덮을수록 치수를 지키기 좋습니다.',
    },
    {
      when: '치수가 점처럼 드러났고 손상 24시간 이내일 때',
      name: '치수 복조술',
      en: 'Direct Pulp Capping',
      detail: 'MTA나 수산화칼슘으로 노출면을 덮어 신경을 살립니다. 1회 처치 후 3~6개월 경과를 봅니다.',
    },
    {
      when: '치수 노출이 크거나 시간이 지났을 때 (미성숙 영구치)',
      name: '부분 치수 절제술 (Cvek)',
      en: 'Partial Pulpotomy',
      detail: '오염된 치수만 2~3mm 걷어내고 나머지를 살립니다. 뿌리가 계속 자라게 하려는 처치입니다.',
    },
    {
      when: '치수 전체가 오염됐거나 뿌리가 다 자란 경우',
      name: '신경치료 후 수복',
      en: 'Root Canal Treatment',
      detail: '치수를 제거하고 충전한 뒤 레진이나 크라운으로 덮습니다. 총 3~5회 방문.',
    },
  ],

  'chigeun-pajeol': [
    {
      when: '뿌리 끝 1/3이 부러졌을 때 (예후 가장 좋음)',
      name: '정복 + 고정',
      en: 'Repositioning and Splinting',
      detail: '위치를 맞추고 4주 고정합니다. 부러진 면이 단단한 조직으로 이어붙는 경우가 많습니다.',
    },
    {
      when: '뿌리 가운데가 부러졌을 때',
      name: '장기 고정 + 경과 관찰',
      en: 'Extended Splinting',
      detail: '최대 4개월까지 고정하며 지켜봅니다. 신경이 죽으면 부러진 윗조각만 신경치료합니다.',
    },
    {
      when: '치경부 가까이 부러져 조각이 흔들릴 때',
      name: '교정적 정출 또는 치관 연장술',
      en: 'Orthodontic Extrusion / Crown Lengthening',
      slug: 'chigwan-yeonjangsul',
      detail: '남은 뿌리를 끌어올리거나 잇몸을 내려 보철을 잡을 자리를 만듭니다. 정출은 6~10주 걸립니다.',
    },
    {
      when: '세로로 뿌리 전체가 갈라졌을 때',
      name: '발치',
      en: 'Extraction',
      detail: '수직 치근 파절은 붙지 않습니다. 뽑고 임플란트나 브릿지로 갑니다.',
    },
  ],

  'balchi-hu-chulhyeol': [
    {
      when: '발치 당일, 피가 배어 나올 때',
      name: '거즈 압박',
      en: 'Gauze Pressure',
      detail: '거즈를 접어 물고 30~60분 세게 뭅니다. 자주 확인하려 뱉으면 굳던 피가 다시 터집니다.',
    },
    {
      when: '압박해도 계속 새어 나올 때',
      name: '지혈제 거즈 · 봉합',
      en: 'Hemostatic Dressing and Suturing',
      detail: '소켓에 지혈 재료를 넣고 꿰맵니다. 치과에서 하면 대개 10~20분이면 잡힙니다.',
    },
    {
      when: '항응고제를 먹고 있는 경우',
      name: '국소 지혈 강화',
      en: 'Local Hemostasis',
      detail: '트라넥삼산 함수와 지혈제를 함께 씁니다. 약은 임의로 끊지 않습니다 — 끊는 위험이 더 큽니다.',
    },
  ],

  // ── 치수·치근단 ──────────────────────────────────────────

  'gayeogjeog-chisuyeom': [
    {
      when: '찬 것에 짧게 시리고 자극이 없어지면 곧 가라앉을 때',
      name: '우식 제거 + 수복',
      en: 'Caries Removal and Restoration',
      detail: '원인이 된 충치를 걷어내고 메웁니다. 신경치료는 필요 없고, 대개 2~4주면 증상이 사라집니다.',
    },
    {
      when: '충치가 아니라 마모·시림이 원인일 때',
      name: '지각과민 처치',
      en: 'Desensitizing Treatment',
      detail: '노출된 상아세관을 막습니다. 1회 5~10분, 필요하면 반복합니다.',
    },
    {
      when: '처치 후',
      name: '경과 관찰',
      en: 'Follow-up',
      detail: '증상이 오히려 심해지거나 밤에 아프면 비가역적으로 넘어간 것이라 신경치료로 방향을 바꿉니다.',
    },
  ],

  'bigayeogjeog-chisuyeom': [
    {
      when: '가만히 있어도 욱신거리고 밤에 심할 때, 응급',
      name: '치수 절제 (응급 개방)',
      en: 'Emergency Pulpectomy',
      detail: '염증이 찬 치수를 제거해 압력을 빼면 통증이 그 자리에서 크게 줄어듭니다. 30~60분.',
    },
    {
      when: '통증이 잡힌 뒤 본 치료',
      name: '신경치료',
      en: 'Root Canal Treatment',
      detail: '근관을 넓혀 소독하고 충전합니다. 2~4회 방문.',
    },
    {
      when: '신경치료를 마친 뒤',
      name: '크라운 수복',
      en: 'Crown Restoration',
      detail: '신경을 뺀 치아는 잘 깨집니다. 어금니는 씌우는 것이 원칙이고 2~3회 방문.',
    },
    {
      when: '뿌리가 심하게 상해 살리기 어려울 때',
      name: '발치',
      en: 'Extraction',
      detail: '치아를 살릴 수 없다고 판단되면 뽑고 임플란트나 브릿지를 계획합니다.',
    },
  ],

  'chisu-goesa': [
    {
      when: '뿌리가 다 자란 영구치',
      name: '신경치료',
      en: 'Root Canal Treatment',
      detail: '죽은 치수를 제거하고 소독해 충전합니다. 통증이 없어도 방치하면 뿌리 끝에 병소가 생깁니다.',
    },
    {
      when: '뿌리가 덜 자란 어린 영구치',
      name: '치수 재생술',
      en: 'Revascularization',
      detail: '근관을 소독한 뒤 혈병을 유도해 뿌리가 계속 자라게 합니다. 6~18개월 경과를 봅니다.',
    },
    {
      when: '뿌리 끝이 열려 있어 충전이 안 될 때',
      name: '근단 형성술',
      en: 'Apexification',
      detail: 'MTA로 뿌리 끝에 마개를 만들어 충전할 바닥을 확보합니다.',
    },
  ],

  'chigeundan-byeongso': [
    {
      when: '처음 생긴 병소, 대부분',
      name: '신경치료',
      en: 'Root Canal Treatment',
      detail: '원인인 근관 속 세균을 없애면 뼈가 다시 찹니다. 6~12개월에 걸쳐 방사선상으로 줄어듭니다.',
    },
    {
      when: '이미 신경치료한 치아에서 다시 생겼을 때',
      name: '재신경치료',
      en: 'Root Canal Retreatment',
      detail: '기존 충전재를 제거하고 다시 소독해 충전합니다. 2~4회 방문.',
    },
    {
      when: '재신경치료로도 낫지 않거나 접근이 어려울 때',
      name: '치근단 절제술',
      en: 'Apicoectomy',
      detail: '잇몸을 열어 뿌리 끝 3mm를 잘라내고 역충전합니다. 1회 수술, 실밥 1주.',
    },
    {
      when: '병소가 크고 치아를 살릴 수 없을 때',
      name: '발치 + 소파',
      en: 'Extraction with Curettage',
      detail: '뽑으면서 병소 조직을 함께 긁어냅니다.',
    },
  ],

  'chigeundan-nangjong': [
    {
      when: '작고 신경치료로 반응할 때',
      name: '신경치료 후 경과 관찰',
      en: 'Root Canal Treatment',
      detail: '원인 치아를 치료하면 작은 낭종은 줄어듭니다. 6~12개월 방사선으로 확인합니다.',
    },
    {
      when: '신경치료 후에도 남아 있을 때',
      name: '치근단 절제술 + 낭종 적출',
      en: 'Apicoectomy with Enucleation',
      detail: '뿌리 끝을 자르면서 낭종 주머니를 통째로 꺼냅니다. 꺼낸 조직은 조직검사로 확인합니다.',
    },
    {
      when: '낭종이 커서 한 번에 꺼내면 위험할 때',
      name: '조대술',
      en: 'Marsupialization',
      detail: '주머니를 열어 크기를 줄인 뒤 나중에 적출합니다. 감압 기간 3~12개월.',
    },
  ],

  // ── 치주 급성 ────────────────────────────────────────────

  'chiju-nongyang': [
    {
      when: '잇몸이 볼록하게 붓고 욱신거릴 때, 응급',
      name: '배농',
      en: 'Drainage',
      detail: '치주낭을 통하거나 절개해 고름을 뺍니다. 빼는 즉시 통증이 크게 줄어듭니다.',
    },
    {
      when: '배농 직후 같은 자리',
      name: '치근활택술',
      en: 'Scaling and Root Planing',
      slug: 'scaling-root-planing',
      detail: '원인인 치석과 오염층을 걷어냅니다. 이것을 안 하면 며칠 뒤 다시 붓습니다.',
    },
    {
      when: '열이 나거나 얼굴까지 부었을 때',
      name: '항생제',
      en: 'Antibiotics',
      detail: '전신 증상이 있을 때만 씁니다. 배농 없이 항생제만 쓰면 잠시 가라앉았다 재발합니다.',
    },
    {
      when: '가라앉은 뒤 뼈 손실이 심할 때',
      name: '치주 수술 또는 발치',
      en: 'Periodontal Surgery or Extraction',
      detail: '남은 뼈로 치아를 지탱할 수 있는지 보고 판단합니다.',
    },
  ],

  'geubseong-goesaseong-gweyangseong-chieunyeom': [
    {
      when: '치간 유두가 헐고 심한 통증·악취가 있을 때',
      name: '초음파 소독 (debridement)',
      en: 'Ultrasonic Debridement',
      detail: '괴사 조직과 치태를 조심스럽게 걷어냅니다. 통증이 24~48시간 안에 극적으로 줄어듭니다.',
    },
    {
      when: '처치와 함께',
      name: '클로르헥시딘 함수',
      en: 'Chlorhexidine Rinse',
      detail: '아파서 칫솔질을 못 하는 동안 치태를 눌러 줍니다. 하루 2회, 1~2주.',
    },
    {
      when: '열이 나거나 림프절이 부었을 때',
      name: '메트로니다졸',
      en: 'Metronidazole',
      detail: '전신 증상이 있을 때 씁니다. 복용 중 음주는 금물입니다.',
    },
    {
      when: '급성기가 지난 뒤',
      name: '치주 치료 + 유발 요인 교정',
      en: 'Periodontal Therapy',
      detail: '흡연·스트레스·수면 부족이 배경인 경우가 많아 함께 다룹니다. 헐어 파인 치은 모양은 남을 수 있습니다.',
    },
  ],

  'imsinseong-chieunyeom': [
    {
      when: '임신 중 잇몸이 붓고 피가 날 때',
      name: '스케일링 + 구강위생 관리',
      en: 'Scaling and Oral Hygiene',
      slug: 'scaling',
      detail: '치태를 걷으면 대부분 좋아집니다. 임신 4~6개월(2삼분기)이 가장 편하게 받을 수 있는 시기입니다.',
    },
    {
      when: '잇몸 한 곳이 혹처럼 부풀었을 때 (임신성 육아종)',
      name: '경과 관찰 후 절제',
      en: 'Observation then Excision',
      detail: '출산 뒤 저절로 줄어드는 경우가 많아 기다립니다. 피가 계속 나거나 씹기 어려우면 그전에 잘라냅니다.',
    },
    {
      when: '출산 후',
      name: '재평가',
      en: 'Reassessment',
      detail: '호르몬이 돌아오면 대개 가라앉습니다. 남아 있으면 원래 있던 잇몸병이라 치주 치료로 넘어갑니다.',
    },
  ],

  'yagmulseong-chieun-jeungsig': [
    {
      when: '거의 모든 경우의 1차 대응',
      name: '철저한 치태 관리',
      en: 'Plaque Control',
      detail: '치태가 있으면 증식이 훨씬 심해집니다. 스케일링과 칫솔질 교육만으로도 상당히 줄어듭니다.',
    },
    {
      when: '원인 약을 바꿀 수 있을 때',
      name: '처방 변경 상담',
      en: 'Medication Substitution',
      detail: '페니토인·사이클로스포린·니페디핀이 대표적입니다. 처방의와 상의하고 임의로 끊지 않습니다.',
    },
    {
      when: '잇몸이 치아를 덮어 씹기·닦기 어려울 때',
      name: '치은 절제술',
      en: 'Gingivectomy',
      slug: 'chieun-jeoljesul',
      detail: '덮인 잇몸을 잘라냅니다. 약을 계속 쓰면 1~2년 뒤 재발할 수 있습니다.',
    },
  ],

  // ── 보철·임플란트 문제 ───────────────────────────────────

  'bocheolmul-talrag': [
    {
      when: '떨어진 보철물이 온전하고 안쪽에 충치가 없을 때',
      name: '재접착',
      en: 'Recementation',
      detail: '안쪽과 치아를 정리해 다시 붙입니다. 1회 방문 20~30분.',
    },
    {
      when: '안쪽에 충치가 생겼을 때',
      name: '우식 제거 후 재제작',
      en: 'Caries Removal and Remake',
      detail: '썩은 부분을 걷어내면 모양이 달라져 그대로 못 씁니다. 새로 만듭니다. 2~3회 방문.',
    },
    {
      when: '남은 치아가 짧아 자꾸 빠질 때',
      name: '포스트·코어 또는 치관 연장술',
      en: 'Post and Core / Crown Lengthening',
      slug: 'post-core',
      detail: '기둥을 세우거나 잇몸을 내려 잡을 자리를 늘립니다. 원인을 두면 다시 붙여도 또 빠집니다.',
    },
  ],

  'impeulranteu-tongjeung': [
    {
      when: '수술 후 3~7일, 점점 줄어드는 통증',
      name: '진통제 + 냉찜질',
      en: 'Analgesics and Cold Compress',
      detail: '정상 경과입니다. 첫 48시간은 냉찜질, 이후 온찜질로 바꿉니다.',
    },
    {
      when: '2주가 지나도 아프거나 다시 심해질 때',
      name: '감염 여부 확인',
      en: 'Infection Assessment',
      detail: '방사선과 임상 검사로 초기 감염이나 골유착 실패를 봅니다. 조기에 잡으면 재식립이 쉽습니다.',
    },
    {
      when: '입술·턱이 저리거나 감각이 둔할 때',
      name: '즉시 재평가',
      en: 'Urgent Nerve Assessment',
      detail: '신경에 눌렸을 수 있어 시간을 다툽니다. 필요하면 픽스처를 빼거나 짧은 것으로 바꿉니다.',
    },
    {
      when: '보철을 끼운 뒤 씹을 때만 아플 때',
      name: '교합 조정',
      en: 'Occlusal Adjustment',
      slug: 'occlusal-adjustment',
      detail: '임플란트는 치주인대가 없어 힘을 완충하지 못합니다. 높이를 조금만 낮춰도 통증이 사라집니다.',
    },
  ],

  // ── 충치 ─────────────────────────────────────────────────

  cavity: [
    {
      when: '법랑질에만 있고 아직 구멍이 안 뚫렸을 때',
      name: '불소 도포 + 관찰',
      en: 'Fluoride Application',
      slug: 'bulso-dopo',
      detail: '초기 우식은 다시 단단해질 수 있습니다. 3~6개월 간격으로 불소를 바르며 진행을 봅니다.',
    },
    {
      when: '구멍이 뚫렸고 범위가 작을 때',
      name: '레진 충전',
      en: 'Composite Restoration',
      slug: 'resin',
      detail: '썩은 부분만 걷어내고 레진으로 메웁니다. 1회 방문, 치아당 20~40분.',
    },
    {
      when: '어금니 씹는 면이 넓게 파였을 때',
      name: '인레이 · 온레이',
      en: 'Inlay / Onlay',
      slug: 'inlay',
      detail: '본을 떠 만든 조각을 끼웁니다. 2회 방문, 레진보다 마모와 변색에 강합니다.',
    },
    {
      when: '남은 치아가 얼마 없을 때',
      name: '크라운',
      en: 'Crown',
      slug: 'crown',
      detail: '치아 전체를 씌워 깨지는 것을 막습니다. 2~3회 방문.',
    },
    {
      when: '충치가 신경까지 닿았을 때',
      name: '신경치료 후 크라운',
      en: 'Root Canal Treatment then Crown',
      slug: 'root-canal',
      detail: '치수를 제거하고 충전한 뒤 씌웁니다. 총 3~5회 방문.',
    },
  ],

  'icha-usig': [
    {
      when: '보철물 가장자리에 생긴 작은 우식',
      name: '변연부 국소 수복',
      en: 'Marginal Repair',
      detail: '보철물을 살리고 썩은 가장자리만 레진으로 메웁니다. 범위가 좁을 때만 가능합니다.',
    },
    {
      when: '우식이 보철물 아래로 퍼졌을 때',
      name: '보철물 제거 후 재제작',
      en: 'Removal and Remake',
      detail: '씌운 것을 떼어내고 우식을 걷은 뒤 새로 만듭니다. 2~3회 방문.',
    },
    {
      when: '재발을 막기 위해',
      name: '변연 적합도 개선 + 불소',
      en: 'Margin Adaptation and Fluoride',
      detail: '보철 경계가 뜨면 그 자리에 또 생깁니다. 정기검진 간격을 3~6개월로 좁힙니다.',
    },
  ],

  // ── 소아 ─────────────────────────────────────────────────

  'yuchi-chungchi': [
    {
      when: '작고 협조가 되는 경우',
      name: '레진 충전',
      en: 'Composite Restoration',
      detail: '유치도 영구치와 같은 방식으로 메웁니다. 1회 방문.',
    },
    {
      when: '여러 면이 썩었거나 범위가 넓을 때',
      name: '기성 금속관 (스테인리스 스틸 크라운)',
      en: 'Stainless Steel Crown',
      slug: 'soa-seuteinriseu-seutil-keuraun',
      detail: '미리 만들어진 금속관을 씌웁니다. 유치는 빠질 때까지만 버티면 되므로 튼튼한 쪽을 택합니다.',
    },
    {
      when: '신경까지 닿았지만 뿌리는 건강할 때',
      name: '치수 절단술',
      en: 'Pulpotomy',
      slug: 'pulpotomy',
      detail: '치관 쪽 치수만 걷어내고 약제로 덮습니다. 1회 처치 후 대개 금속관을 씌웁니다.',
    },
    {
      when: '뿌리 끝까지 염증이 번졌을 때',
      name: '유치 신경치료 또는 발치',
      en: 'Pulpectomy or Extraction',
      slug: 'yuchi-singyeongchiryo',
      detail: '영구치싹이 다치지 않게 판단합니다. 뽑으면 공간 유지 장치를 함께 계획합니다.',
    },
  ],

  'yua-usig': [
    {
      when: '무엇보다 먼저',
      name: '수유·간식 습관 교정',
      en: 'Feeding Habit Modification',
      detail: '젖병을 물고 잠드는 습관을 끊습니다. 이것을 안 고치면 때워도 옆 치아가 계속 썩습니다.',
    },
    {
      when: '초기 백색 병소일 때',
      name: '불소 바니시 도포',
      en: 'Fluoride Varnish',
      detail: '3~6개월마다 바릅니다. 아직 구멍이 안 뚫렸으면 되돌릴 수 있습니다.',
    },
    {
      when: '진행을 멈춰야 하는데 치료 협조가 어려울 때',
      name: '불화디아민은(SDF) 도포',
      en: 'Silver Diamine Fluoride',
      detail: '바르면 진행이 멈춥니다. 다만 그 부위가 검게 변합니다.',
    },
    {
      when: '치아 여러 개가 광범위하게 썩었을 때',
      name: '진정 또는 전신마취 하 치료',
      en: 'Sedation / General Anesthesia',
      slug: 'soa-jinjeongchiryo',
      detail: '한 번에 모두 처치합니다. 여러 번 나눠 겁을 주는 것보다 나은 경우가 많습니다.',
    },
  ],

  'yuchi-jogi-sangsil': [
    {
      when: '어금니가 일찍 빠졌을 때',
      name: '공간 유지 장치',
      en: 'Space Maintainer',
      slug: 'gonggan-yuji-jangchi',
      detail: '빈자리로 옆 치아가 쓰러지는 것을 막습니다. 영구치가 나올 때까지 끼우고 6개월마다 점검합니다.',
    },
    {
      when: '앞니가 빠졌을 때',
      name: '대개 장치 없이 관찰',
      en: 'Observation',
      detail: '앞니 자리는 잘 좁아지지 않습니다. 다만 발음이나 심미가 걱정되면 소아용 보철을 씁니다.',
    },
    {
      when: '이미 공간이 좁아졌을 때',
      name: '공간 회복 장치 또는 교정',
      en: 'Space Regainer',
      detail: '쓰러진 치아를 되세워 자리를 되찾습니다. 3~6개월 걸립니다.',
    },
  ],

  'songarag-bbalgi': [
    {
      when: '만 3~4세 이전',
      name: '경과 관찰',
      en: 'Observation',
      detail: '이 나이에 그치면 대개 저절로 돌아옵니다. 혼내는 것은 도움이 되지 않습니다.',
    },
    {
      when: '만 4세가 지나도 계속할 때',
      name: '행동 유도 · 보상 요법',
      en: 'Behavioral Approach',
      detail: '달력에 표시하고 칭찬으로 유도합니다. 아이가 스스로 그만두려 할 때 성공률이 높습니다.',
    },
    {
      when: '습관이 남아 앞니가 벌어질 때',
      name: '습관 차단 장치',
      en: 'Habit-Breaking Appliance',
      detail: '입천장에 장치를 걸어 손가락이 닿는 감각을 없앱니다. 6~12개월 착용.',
    },
  ],

  // ── 구강 점막 ────────────────────────────────────────────

  'gugang-kandidajeung': [
    {
      when: '입천장·혀에 하얗게 끼고 닦으면 벗겨질 때',
      name: '국소 항진균제',
      en: 'Topical Antifungal',
      detail: '나이스타틴 현탁액을 하루 4회, 7~14일 씁니다. 증상이 사라져도 며칠 더 씁니다.',
    },
    {
      when: '틀니를 쓰는 경우',
      name: '틀니 소독 병행',
      en: 'Denture Disinfection',
      detail: '틀니에 곰팡이가 남아 재감염됩니다. 밤에는 빼서 소독액에 담급니다.',
    },
    {
      when: '국소 치료에 반응이 없거나 범위가 넓을 때',
      name: '전신 항진균제',
      en: 'Systemic Antifungal',
      detail: '플루코나졸을 7~14일 복용합니다. 다른 약과 상호작용이 있어 복용 중인 약을 알려야 합니다.',
    },
    {
      when: '자주 재발할 때',
      name: '유발 요인 점검',
      en: 'Predisposing Factor Review',
      detail: '당뇨, 흡입형 스테로이드, 구강건조, 면역 저하를 확인합니다. 배경을 두면 반복됩니다.',
    },
  ],

  pyeonpyeongtaeseon: [
    {
      when: '레이스 무늬만 있고 아프지 않을 때',
      name: '경과 관찰',
      en: 'Observation',
      detail: '치료 없이 6~12개월 간격으로 봅니다. 없애는 병이 아니라 지켜보는 병입니다.',
    },
    {
      when: '헐고 쓰라려 먹기 힘들 때',
      name: '국소 스테로이드',
      en: 'Topical Corticosteroid',
      detail: '연고나 함수로 증상을 눌러 줍니다. 2~4주 쓰고 반응을 봅니다.',
    },
    {
      when: '국소 치료로 안 잡힐 때',
      name: '전신 면역조절제',
      en: 'Systemic Immunomodulator',
      detail: '전신 스테로이드나 면역억제제를 단기간 씁니다. 부작용이 있어 필요한 경우에만 씁니다.',
    },
    {
      when: '오래된 병소, 특히 헐어 있는 형태',
      name: '정기 추적 + 조직검사',
      en: 'Surveillance and Biopsy',
      detail: '드물게 악성 변화가 보고됩니다. 6~12개월 간격으로 보고, 모양이 변하면 조직검사를 합니다.',
    },
  ],

  baegbanjeung: [
    {
      when: '병소를 발견한 모든 경우, 가장 먼저',
      name: '원인 제거',
      en: 'Removal of Cause',
      detail: '금연과 금주가 핵심입니다. 날카로운 보철이 닿으면 그것도 다듬습니다. 2~4주 뒤 다시 봅니다.',
    },
    {
      when: '원인을 없애도 남아 있을 때',
      name: '조직검사',
      en: 'Biopsy',
      detail: '백반증은 임상 진단만으로 안심할 수 없습니다. 이형성 여부를 확인해야 방향이 정해집니다.',
    },
    {
      when: '이형성이 확인되거나 범위가 좁을 때',
      name: '외과적 절제',
      en: 'Surgical Excision',
      detail: '메스나 레이저로 잘라냅니다. 잘라도 다른 자리에 생길 수 있어 추적이 필요합니다.',
    },
    {
      when: '절제 후에도 평생',
      name: '정기 추적',
      en: 'Long-term Follow-up',
      detail: '3~6개월 간격으로 봅니다. 백반증은 구강암으로 갈 수 있는 전암 병소입니다.',
    },
  ],

  jeomaegnangjong: [
    {
      when: '작고 처음 생겼을 때',
      name: '경과 관찰',
      en: 'Observation',
      detail: '저절로 터져 없어지는 경우가 있습니다. 2~4주 지켜봅니다.',
    },
    {
      when: '반복해서 생기거나 씹을 때 걸릴 때',
      name: '낭종 적출술',
      en: 'Surgical Excision',
      detail: '주머니와 함께 원인이 된 작은 침샘까지 제거합니다. 침샘을 남기면 재발합니다. 1회 수술, 실밥 1주.',
    },
    {
      when: '아랫입술을 자주 깨무는 습관이 있을 때',
      name: '습관 교정',
      en: 'Habit Modification',
      detail: '깨무는 자극이 원인입니다. 고치지 않으면 잘라내도 또 생깁니다.',
    },
  ],

  // ── 교합·습관 ────────────────────────────────────────────

  bruxism: [
    {
      when: '거의 모든 이갈이의 기본 처치',
      name: '교합안정장치 (나이트가드)',
      en: 'Occlusal Splint',
      slug: 'splint',
      detail: '자는 동안 끼워 치아 마모와 턱 부담을 막습니다. 제작 2~3회 방문, 6개월마다 점검.',
    },
    {
      when: '스트레스·수면 문제가 배경일 때',
      name: '유발 요인 관리',
      en: 'Trigger Management',
      detail: '카페인·음주·수면 부족을 줄입니다. 이갈이는 없애기보다 줄이고 피해를 막는 쪽으로 봅니다.',
    },
    {
      when: '씹는 근육이 두꺼워지고 아플 때',
      name: '이갈이 보톡스',
      en: 'Botulinum Toxin',
      slug: 'igali-botogseu',
      detail: '교근에 주사해 힘을 줄입니다. 3~6개월마다 반복합니다.',
    },
    {
      when: '이미 치아가 닳아 시리거나 깨졌을 때',
      name: '마모면 수복',
      en: 'Restoration of Worn Teeth',
      detail: '레진이나 크라운으로 형태를 되살립니다. 장치를 같이 쓰지 않으면 새로 한 것도 또 닳습니다.',
    },
  ],

  bandaegyohab: [
    {
      when: '유치열·혼합치열기 아동, 앞니만 반대일 때',
      name: '가철식 장치 또는 고정식 교정',
      en: 'Removable or Fixed Appliance',
      detail: '앞니를 앞으로 밀어 정상 관계로 바꿉니다. 3~6개월이면 되는 경우가 많습니다.',
    },
    {
      when: '위턱이 작아서 생긴 경우 (성장기)',
      name: '상악 확장 + 전방 견인',
      en: 'Expansion and Facemask',
      detail: '위턱을 넓히고 앞으로 끌어냅니다. 만 8~10세가 효과가 가장 좋아 시기를 놓치면 어려워집니다.',
    },
    {
      when: '어금니까지 반대이거나 성장이 끝난 경우',
      name: '전체 교정',
      en: 'Comprehensive Orthodontics',
      detail: '치아 배열 전체를 다시 잡습니다. 18~30개월.',
    },
    {
      when: '아래턱이 크게 나온 골격성 (성인)',
      name: '악교정 수술 + 교정',
      en: 'Orthognathic Surgery',
      slug: 'aggyojeong-susul',
      detail: '턱뼈 위치를 옮깁니다. 수술 전후 교정 포함 18~30개월.',
    },
  ],

  gaebanggyohab: [
    {
      when: '손가락 빨기·혀 내밀기가 원인인 아동',
      name: '습관 차단 장치',
      en: 'Habit-Breaking Appliance',
      detail: '원인을 없애면 어린 나이일수록 저절로 닫힙니다. 6~12개월 착용.',
    },
    {
      when: '치아 위치 문제만 있는 경우',
      name: '교정 (어금니 함입)',
      en: 'Molar Intrusion',
      detail: '미니스크류로 어금니를 눌러 앞니가 닿게 만듭니다. 12~24개월.',
    },
    {
      when: '골격성으로 심한 경우',
      name: '악교정 수술 + 교정',
      en: 'Orthognathic Surgery',
      slug: 'aggyojeong-susul',
      detail: '위턱 뒤쪽을 올려 회전시킵니다. 교정 포함 18~30개월.',
    },
    {
      when: '치료를 마친 뒤',
      name: '유지장치 + 혀 습관 관리',
      en: 'Retention',
      slug: 'retainer',
      detail: '개방교합은 재발이 잦습니다. 혀 습관이 남아 있으면 특히 그렇습니다.',
    },
  ],

  // ── 기타 ─────────────────────────────────────────────────

  'chigwa-gongpojeung': [
    {
      when: '어느 정도 참을 수 있는 불안',
      name: '행동 조절 · 단계적 노출',
      en: 'Behavioral Management',
      detail: '짧고 쉬운 진료부터 시작해 익숙해지게 합니다. 손을 들면 멈추는 신호를 정해 두면 통제감이 생깁니다.',
    },
    {
      when: '주사·소리에 대한 불안이 클 때',
      name: '표면 마취 + 무통 마취',
      en: 'Topical and Slow Anesthesia',
      slug: 'pyomyeon-machwi',
      detail: '바르는 마취로 찌르는 느낌을 줄이고 천천히 주입합니다. 통증 경험이 줄면 불안도 함께 줄어듭니다.',
    },
    {
      when: '진료 자체가 어려울 정도일 때',
      name: '의식하 진정 (수면치과)',
      en: 'Conscious Sedation',
      slug: 'sedation',
      detail: '약으로 긴장을 낮춰 진료를 받게 합니다. 의식은 있고 기억은 흐릿하게 남습니다.',
    },
    {
      when: '진정으로도 어렵거나 처치량이 많을 때',
      name: '전신마취 하 치료',
      en: 'General Anesthesia',
      detail: '한 번에 모두 끝냅니다. 마취 전문의가 함께하는 시설에서 합니다.',
    },
  ],

  taseogjeung: [
    {
      when: '돌이 작고 입구 가까이 있을 때',
      name: '보존적 배출 유도',
      en: 'Conservative Management',
      detail: '신 음식으로 침 분비를 늘리고 침샘을 마사지해 밀어냅니다. 수분 섭취를 늘립니다.',
    },
    {
      when: '입구 가까이 만져지는 돌',
      name: '관내 절석술',
      en: 'Intraoral Sialolithotomy',
      detail: '도관을 열어 돌을 꺼냅니다. 국소마취로 하고 대개 1회로 끝납니다.',
    },
    {
      when: '돌이 깊거나 여러 개일 때',
      name: '타액선 내시경',
      en: 'Sialendoscopy',
      detail: '가는 내시경을 도관에 넣어 돌을 꺼내거나 부숩니다. 침샘을 살리는 방법입니다.',
    },
    {
      when: '침샘이 반복 감염으로 망가졌을 때',
      name: '침샘 절제',
      en: 'Gland Excision',
      detail: '기능을 잃은 침샘을 제거합니다. 마지막 선택입니다.',
    },
  ],

  guhoheub: [
    {
      when: '코가 막혀 어쩔 수 없이 입으로 쉴 때',
      name: '이비인후과 진료',
      en: 'ENT Referral',
      detail: '비염·아데노이드·편도 비대를 먼저 해결합니다. 원인을 두고 입만 다물게 할 수는 없습니다.',
    },
    {
      when: '코 문제가 해결된 뒤에도 습관이 남을 때',
      name: '구순 폐쇄 훈련 · 근기능 요법',
      en: 'Myofunctional Therapy',
      detail: '입술과 혀 위치를 다시 익힙니다. 하루 10~15분, 6개월 이상 해야 자리 잡습니다.',
    },
    {
      when: '위턱이 좁아졌을 때 (성장기)',
      name: '상악 확장 장치',
      en: 'Palatal Expander',
      slug: 'gugae-hwagjang-jangchi',
      detail: '좁아진 위턱을 넓혀 코로 숨쉬기 쉽게 만듭니다. 3~6개월 확장 후 유지.',
    },
    {
      when: '잇몸이 늘 말라 붓고 피가 날 때',
      name: '치은염 관리',
      en: 'Gingivitis Care',
      slug: 'gingivitis',
      detail: '입으로 숨쉬면 앞니 잇몸이 마르며 붓습니다. 스케일링과 보습을 함께합니다.',
    },
  ],

  // ── 치주 만성 ────────────────────────────────────────────

  'manseong-chijuyeom': [
    {
      when: '치주낭 4~5mm, 대부분의 시작점',
      name: '치근활택술 (SRP)',
      en: 'Scaling and Root Planing',
      slug: 'scaling-root-planing',
      detail: '잇몸 속 치석과 오염층을 걷어냅니다. 2~4회로 나눠 하고 4~6주 뒤 재평가합니다.',
    },
    {
      when: 'SRP 후에도 6mm 이상 남았을 때',
      name: '치주 판막 수술',
      en: 'Periodontal Flap Surgery',
      detail: '잇몸을 젖혀 직접 보면서 제거합니다. 부위당 1회, 실밥 1~2주.',
    },
    {
      when: '치아가 흔들려 씹기 불편할 때',
      name: '치주 스플린트',
      en: 'Periodontal Splinting',
      slug: 'chiju-seupeulrinteu',
      detail: '흔들리는 치아를 옆 치아와 묶어 힘을 나눕니다. 뼈가 늘지는 않지만 쓰기 편해집니다.',
    },
    {
      when: '치료를 마친 뒤 평생',
      name: '치주 유지관리',
      en: 'Periodontal Maintenance',
      slug: 'chiju-yujigwanri',
      detail: '3~4개월 간격 관리로 재발을 막습니다. 관리를 놓으면 몇 년 안에 되돌아갑니다.',
    },
  ],

  'gonggyeogseong-chijuyeom': [
    {
      when: '진단 즉시',
      name: '치근활택술 + 전신 항생제',
      en: 'SRP with Systemic Antibiotics',
      detail: '일반 치주염과 달리 항생제를 함께 씁니다. 아목시실린+메트로니다졸 병용이 표준입니다.',
    },
    {
      when: '기계적 치료로 부족할 때',
      name: '치주 수술 + 재생술',
      en: 'Surgery with Regeneration',
      detail: '젊은 나이에 뼈가 깊게 파이는 경우가 많아 재생을 함께 시도합니다. 재평가까지 6~9개월.',
    },
    {
      when: '가족 중에 같은 병이 있을 때',
      name: '가족 검진',
      en: 'Family Screening',
      detail: '유전 경향이 뚜렷합니다. 형제·자녀를 함께 봐야 조기에 잡습니다.',
    },
    {
      when: '치료 후',
      name: '짧은 간격 유지관리',
      en: 'Frequent Maintenance',
      detail: '2~3개월 간격으로 봅니다. 일반 치주염보다 더 자주 봐야 합니다.',
    },
  ],

  'chieun-chulhyeol': [
    {
      when: '칫솔질할 때 피가 나는 대부분의 경우',
      name: '스케일링 + 칫솔질 교정',
      en: 'Scaling and Brushing Instruction',
      slug: 'scaling',
      detail: '치태·치석이 원인입니다. 걷어내면 1~2주 안에 멎습니다. 피가 난다고 안 닦으면 더 심해집니다.',
    },
    {
      when: '스케일링 후에도 계속될 때',
      name: '치주 치료',
      en: 'Periodontal Therapy',
      detail: '잇몸 속까지 염증이 내려간 것이라 치근활택술로 넘어갑니다.',
    },
    {
      when: '잇몸은 깨끗한데 피가 잘 멎지 않을 때',
      name: '전신 원인 검사',
      en: 'Systemic Workup',
      detail: '혈액질환, 항응고제, 비타민 결핍을 확인합니다. 드물지만 놓치면 안 됩니다.',
    },
  ],

  'chijogol-heubsu': [
    {
      when: '치주염이 원인일 때',
      name: '치주 치료로 진행 정지',
      en: 'Periodontal Therapy',
      detail: '녹은 뼈를 되돌리기보다 더 녹지 않게 막는 것이 목표입니다. 3~4개월 유지관리를 붙입니다.',
    },
    {
      when: '결손이 좁고 깊게 파였을 때',
      name: '치주 조직 재생술',
      en: 'Guided Tissue Regeneration',
      slug: 'chiju-jaesaengsul',
      detail: '골이식재와 차단막으로 뼈가 차오를 공간을 만듭니다. 판정까지 6~9개월.',
    },
    {
      when: '발치 예정이고 나중에 임플란트를 할 때',
      name: '치조골 보존술',
      en: 'Ridge Preservation',
      slug: 'chijogol-bojonsul',
      detail: '뽑은 자리에 바로 골이식재를 채워 뼈가 꺼지는 것을 줄입니다. 3~6개월 뒤 식립.',
    },
    {
      when: '이미 뼈가 많이 없어진 상태에서 임플란트가 필요할 때',
      name: '골유도재생술 (GBR)',
      en: 'Guided Bone Regeneration',
      slug: 'gbr',
      detail: '차단막과 골이식재로 뼈를 만들어 냅니다. 4~6개월 뒤 임플란트를 심습니다.',
    },
  ],

  'impacted-tooth': [
    {
      when: '증상이 없고 주변에 손상도 없을 때',
      name: '경과 관찰',
      en: 'Observation',
      detail: '1~2년 간격으로 방사선을 찍어 봅니다. 매복치를 모두 뽑아야 하는 것은 아닙니다.',
    },
    {
      when: '반복해 붓거나 옆 치아를 망가뜨릴 때',
      name: '발치',
      en: 'Surgical Extraction',
      slug: 'bogjab-balchi',
      detail: '잇몸을 열고 필요하면 치아를 나눠 꺼냅니다. 30~60분, 붓기는 3~5일.',
    },
    {
      when: '교정으로 살려 쓸 수 있는 앞니·송곳니일 때',
      name: '외과적 노출 + 교정적 견인',
      en: 'Surgical Exposure and Traction',
      detail: '잇몸을 열어 장치를 붙이고 제자리로 끌어냅니다. 12~24개월.',
    },
    {
      when: '주위에 낭종이 생겼을 때',
      name: '발치 + 낭종 적출',
      en: 'Extraction with Enucleation',
      detail: '치아와 낭종을 함께 제거합니다. 꺼낸 조직은 조직검사로 확인합니다.',
    },
  ],

  supernumerary: [
    {
      when: '증상이 없고 다른 치아를 방해하지 않을 때',
      name: '경과 관찰',
      en: 'Observation',
      detail: '방사선으로 6~12개월마다 봅니다. 위치가 깊고 조용하면 두고 보기도 합니다.',
    },
    {
      when: '영구치가 못 나오게 막고 있을 때',
      name: '조기 발치',
      en: 'Early Extraction',
      detail: '빨리 뽑을수록 영구치가 저절로 나올 가능성이 높습니다. 만 7~9세에 판단하는 경우가 많습니다.',
    },
    {
      when: '발치 후에도 영구치가 안 나올 때',
      name: '교정적 견인',
      en: 'Orthodontic Traction',
      detail: '장치를 붙여 끌어냅니다. 12~18개월.',
    },
  ],

  // ── 신경 손상·통증 ───────────────────────────────────────

  'hachijosingyeong-sonsang': [
    {
      when: '손상 직후 확인된 경우',
      name: '원인 제거 · 감압',
      en: 'Decompression',
      detail: '신경을 누르는 임플란트나 충전재를 빼거나 위치를 바꿉니다. 빠를수록 회복 가능성이 높습니다.',
    },
    {
      when: '초기 몇 주',
      name: '약물 치료',
      en: 'Pharmacotherapy',
      detail: '스테로이드와 비타민 B군을 씁니다. 신경병증 통증이 있으면 가바펜틴 계열을 더합니다.',
    },
    {
      when: '회복 경과를 보는 동안',
      name: '정기 감각 검사',
      en: 'Serial Sensory Testing',
      detail: '범위를 지도처럼 기록해 비교합니다. 대부분 3~6개월에 걸쳐 서서히 돌아옵니다.',
    },
    {
      when: '6~12개월이 지나도 회복이 없을 때',
      name: '미세신경 수술 의뢰',
      en: 'Microneurosurgery Referral',
      detail: '끊어진 신경을 잇는 수술을 검토합니다. 시기를 놓치면 성공률이 떨어집니다.',
    },
  ],

  samchasingyeongtong: [
    {
      when: '거의 모든 환자의 1차 치료',
      name: '카바마제핀',
      en: 'Carbamazepine',
      detail: '항경련제가 표준입니다. 대부분 수일 안에 통증이 크게 줄어 진단에도 도움이 됩니다.',
    },
    {
      when: '부작용이 있거나 효과가 부족할 때',
      name: '다른 항경련제로 교체·병용',
      en: 'Alternative Anticonvulsants',
      detail: '옥스카바제핀, 라모트리진 등을 씁니다. 일반 진통제는 듣지 않습니다.',
    },
    {
      when: '약으로 조절이 안 될 때',
      name: '신경 차단술',
      en: 'Nerve Block',
      detail: '통증 유발 가지에 약을 넣어 신호를 끊습니다. 효과는 수개월 갑니다.',
    },
    {
      when: '혈관이 신경을 누르는 것이 확인됐을 때',
      name: '미세혈관 감압술',
      en: 'Microvascular Decompression',
      detail: '신경을 누르는 혈관을 떼어 놓는 뇌수술입니다. 장기 성공률이 가장 높습니다.',
    },
  ],

  // ── 감염 ─────────────────────────────────────────────────

  'chiseong-gamyeom': [
    {
      when: '고름이 잡혔을 때, 가장 먼저',
      name: '절개 배농',
      en: 'Incision and Drainage',
      slug: 'jeolgae-baenong',
      detail: '고름을 빼는 것이 항생제보다 우선입니다. 빼는 즉시 통증과 붓기가 줄어듭니다.',
    },
    {
      when: '배농과 함께',
      name: '원인 치아 처치',
      en: 'Treatment of Source Tooth',
      detail: '신경치료로 살리거나 뽑습니다. 원인을 두면 항생제를 끊는 순간 재발합니다.',
    },
    {
      when: '열이 나거나 부기가 번질 때',
      name: '항생제',
      en: 'Antibiotics',
      detail: '아목시실린 계열을 5~7일 씁니다. 배농 없이 항생제만 쓰면 안으로 곪습니다.',
    },
    {
      when: '눈 밑·목으로 번지거나 숨쉬기·삼키기 힘들 때',
      name: '응급 입원 치료',
      en: 'Emergency Admission',
      detail: '기도를 막을 수 있어 응급입니다. 즉시 큰 병원으로 가야 합니다.',
    },
  ],

  'chiseong-sangagdongyeom': [
    {
      when: '원인이 윗어금니일 때, 핵심',
      name: '원인 치아 처치',
      en: 'Treatment of Source Tooth',
      detail: '신경치료나 발치로 감염원을 없앱니다. 코만 치료하면 낫지 않습니다.',
    },
    {
      when: '급성기',
      name: '항생제 + 비강 스프레이',
      en: 'Antibiotics and Nasal Decongestant',
      detail: '아목시클라불란산을 10~14일 쓰고 배출을 돕습니다.',
    },
    {
      when: '발치하다 상악동이 뚫렸을 때',
      name: '구강-상악동 교통 폐쇄술',
      en: 'Closure of Oroantral Communication',
      slug: 'gugangsangagdong-gyotong',
      detail: '잇몸 판막으로 구멍을 덮습니다. 코를 세게 풀지 않는 것이 중요합니다.',
    },
    {
      when: '치아를 처치해도 낫지 않을 때',
      name: '이비인후과 내시경 수술',
      en: 'Functional Endoscopic Sinus Surgery',
      detail: '상악동 배출로를 넓혀 줍니다. 치과와 이비인후과가 함께 봅니다.',
    },
  ],

  'yagmul-gwanryeon-teogbbyeo-goesa': [
    {
      when: '무엇보다 예방이 우선',
      name: '투약 전 치과 검진',
      en: 'Pre-treatment Dental Screening',
      detail: '골흡수억제제를 시작하기 전에 발치·수술을 끝내 둡니다. 시작 후에는 선택지가 크게 줄어듭니다.',
    },
    {
      when: '뼈가 드러났지만 증상이 가벼울 때',
      name: '보존적 관리',
      en: 'Conservative Management',
      detail: '클로르헥시딘 함수와 감염 조절로 유지합니다. 무리한 수술이 오히려 범위를 넓힙니다.',
    },
    {
      when: '감염이 동반될 때',
      name: '항생제',
      en: 'Antibiotics',
      detail: '증상 조절을 목표로 장기간 쓰기도 합니다.',
    },
    {
      when: '뼈가 죽어 떨어져 나오고 범위가 뚜렷할 때',
      name: '부골 제거술',
      en: 'Sequestrectomy',
      detail: '죽은 뼈만 조심스럽게 제거합니다. 정상 뼈까지 건드리면 악화됩니다.',
    },
  ],

  // ── 법랑질 형성 이상 ─────────────────────────────────────

  'hwaiteu-seupas': [
    {
      when: '초기 탈회로 생긴 하얀 반점',
      name: '불소 · 재광화 요법',
      en: 'Remineralization',
      detail: '불소와 칼슘·인 제제를 3~6개월 씁니다. 초기라면 상당히 옅어집니다.',
    },
    {
      when: '재광화로 부족하고 얕게 있을 때',
      name: '레진 침윤술',
      en: 'Resin Infiltration',
      detail: '표면을 열고 레진을 스며들게 해 색을 맞춥니다. 삭제 없이 1회로 끝납니다.',
    },
    {
      when: '반점이 깊거나 넓을 때',
      name: '미세 연마 또는 레진 수복',
      en: 'Microabrasion or Composite',
      detail: '표층을 얇게 갈아내거나 레진으로 덮습니다. 1~2회 방문.',
    },
    {
      when: '앞니 전체가 얼룩덜룩할 때',
      name: '라미네이트',
      en: 'Laminate Veneer',
      slug: 'laminate',
      detail: '앞면을 덮어 색과 형태를 한 번에 맞춥니다. 2~3회 방문.',
    },
  ],

  mih: [
    {
      when: '시림이 있고 아직 부서지지 않았을 때',
      name: '불소 도포 + 지각과민 처치',
      en: 'Fluoride and Desensitization',
      slug: 'bulso-dopo',
      detail: 'MIH 치아는 마취가 잘 안 듣고 시림이 심합니다. 먼저 표면을 단단하게 만듭니다.',
    },
    {
      when: '씹는 면이 부서지기 시작했을 때',
      name: '실란트 · 레진 수복',
      en: 'Sealant or Composite',
      slug: 'sealant',
      detail: '약한 법랑질이 더 떨어져 나가지 않게 덮습니다. 잘 떨어져 6개월마다 점검합니다.',
    },
    {
      when: '어금니 손상이 클 때',
      name: '기성 금속관',
      en: 'Stainless Steel Crown',
      slug: 'soa-seuteinriseu-seutil-keuraun',
      detail: '전체를 씌워 더 부서지는 것을 막습니다. 영구 크라운은 성장이 끝난 뒤 다시 봅니다.',
    },
    {
      when: '살리기 어렵고 교정이 필요한 경우',
      name: '계획적 발치 + 교정',
      en: 'Planned Extraction with Orthodontics',
      detail: '제1대구치를 뽑고 사랑니·제2대구치를 앞으로 당깁니다. 만 8~10세 시기가 중요합니다.',
    },
  ],
};

/** 치료 블록이 있는 용어인지 */
export function hasApproach(slug: string): boolean {
  return Boolean(termApproaches[slug]?.length);
}
