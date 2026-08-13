/**
 * 용어별 영문명 — 용어 페이지·카드에 병기한다.
 *
 * 건강보험·실비보험처럼 한국 제도에만 있는 개념은 억지로 옮기지 않고 비워 둔다.
 * 이름 자체가 이미 영문인 용어(All-on-4 등)도 비운다.
 * 표기는 각 단어 첫 글자를 대문자로 (고유명사·약어는 관례대로).
 */
export const termNamesEn: Record<string, string> = {
  // 해부·조직
  'chia-gujo': 'Tooth Anatomy',
  chigwan: 'Anatomical Crown',
  chigeun: 'Tooth Root',
  chisugang: 'Pulp Chamber',
  baegagjil: 'Cementum',
  chisu: 'Dental Pulp',
  beobrangjinju: 'Enamel Pearl',
  molar: 'Molar',
  'permanent-tooth': 'Permanent Tooth',
  'primary-tooth': 'Primary Tooth',
  supernumerary: 'Supernumerary Tooth',
  'impacted-tooth': 'Impacted Tooth',

  // 충치·치수
  cavity: 'Tooth Decay',
  caries: 'Dental Caries',
  'gayeogjeog-chisuyeom': 'Reversible Pulpitis',
  'bigayeogjeog-chisuyeom': 'Irreversible Pulpitis',
  'root-canal': 'Root Canal Treatment',
  'root-canal-re': 'Endodontic Retreatment',
  'apical-periodontitis': 'Apical Periodontitis',
  apicoectomy: 'Apicoectomy',
  pulpotomy: 'Pulpotomy',
  'rubber-dam': 'Rubber Dam',
  'conservative-dentistry': 'Conservative Dentistry',

  // 수복·보철
  resin: 'Composite Resin',
  inlay: 'Inlay',
  onlay: 'Onlay',
  'gold-inlay': 'Gold Inlay',
  crown: 'Dental Crown',
  zirconia: 'Zirconia',
  pfm: 'Porcelain-Fused-to-Metal',
  cerec: 'CEREC',
  bridge: 'Dental Bridge',
  prosthesis: 'Dental Prosthesis',
  'post-core': 'Post and Core',
  denture: 'Denture',
  overdenture: 'Overdenture',
  laminate: 'Laminate Veneer',
  'tooth-discoloration': 'Tooth Discoloration',
  whitening: 'Tooth Whitening',
  'tooth-gem': 'Tooth Gem',

  // 임플란트
  implant: 'Dental Implant',
  'immediate-implant': 'Immediate Implant Placement',
  'impeulranteu-sumyeong': 'Implant Longevity',
  'peri-implantitis': 'Peri-implantitis',
  osseointegration: 'Osseointegration',
  'bone-graft': 'Bone Graft',
  gbr: 'Guided Bone Regeneration',
  'sinus-lift': 'Maxillary Sinus Lift',

  // 잇몸·치주
  chieun: 'Gingiva',
  buchagchieun: 'Attached Gingiva',
  chieunyeolgu: 'Gingival Sulcus',
  chijuindae: 'Periodontal Ligament',
  chijogol: 'Alveolar Bone',
  'chieun-toechug': 'Gingival Recession',
  gingivitis: 'Gingivitis',
  periodontitis: 'Periodontitis',
  'periodontal-pocket': 'Periodontal Pocket',
  'scaling-root-planing': 'Root Planing',
  scaling: 'Dental Scaling',
  calculus: 'Dental Calculus',
  'gum-graft': 'Gingival Graft',
  'bagriseong-chieunyeom': 'Desquamative Gingivitis',
  pericoronitis: 'Pericoronitis',

  // 발치·외과
  extraction: 'Tooth Extraction',
  'wisdom-tooth': 'Third Molar',
  'dry-socket': 'Alveolar Osteitis',
  'balchi-hu-juuisahang': 'Post-Extraction Care',
  'local-anesthesia': 'Local Anesthesia',
  sedation: 'Conscious Sedation',
  'nitrous-oxide': 'Nitrous Oxide',

  // 교정·교합
  orthodontics: 'Orthodontic Treatment',
  malocclusion: 'Malocclusion',
  invisalign: 'Invisalign',
  retainer: 'Orthodontic Retainer',
  'occlusal-adjustment': 'Occlusal Adjustment',
  bruxism: 'Bruxism',
  splint: 'Occlusal Splint',
  tmd: 'Temporomandibular Disorder',

  // 파절·마모·과민
  'cracked-tooth': 'Cracked Tooth Syndrome',
  'tooth-fracture': 'Tooth Fracture',
  'chigyeongbu-mamojeung': 'Non-Carious Cervical Lesion',
  sensitivity: 'Dentin Hypersensitivity',

  // 점막·기타
  'jaebalseong-apeuta-gunaeyeom': 'Recurrent Aphthous Stomatitis',
  halitosis: 'Halitosis',

  // 예방·소아
  fluoride: 'Fluoride',
  sealant: 'Pit and Fissure Sealant',
  floss: 'Dental Floss',
  'dental-checkup': 'Dental Check-up',
  'pediatric-dentistry': 'Pediatric Dentistry',
};
