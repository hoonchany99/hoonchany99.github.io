/**
 * 주제별 허브 아이콘 — 이모지 대신 선 굵기·스타일을 통일한 인라인 SVG.
 * 이모지는 OS/브라우저마다 모양과 색이 달라 6개가 한 세트로 보이지 않는다.
 * slug 기준으로 그리므로 topicHubs 데이터에는 아이콘 필드를 두지 않는다.
 */

/** 어금니 실루엣 — 충치·크라운·사랑니·미백이 공유하는 기본 형태 */
const TOOTH_PATH =
  'M12 3.6 c-1.5 -1 -3.2 -1.4 -4.8 -1 C4.8 3.2 3.4 5.2 3.6 7.8 ' +
  'c0.2 2.6 1.4 4.2 2 6.8 c0.4 1.9 0.4 6.4 2 6.4 c1.4 0 1.4 -3.5 2 -6 ' +
  'c0.4 -1.8 1.2 -2.4 2.4 -2.4 s2 0.6 2.4 2.4 c0.6 2.5 0.6 6 2 6 ' +
  'c1.6 0 1.6 -4.5 2 -6.4 c0.6 -2.6 1.8 -4.2 2 -6.8 ' +
  'c0.2 -2.6 -1.2 -4.6 -3.6 -5.2 c-1.6 -0.4 -3.3 0 -4.8 1 Z';

interface Props {
  slug: string;
  className?: string;
}

function Cavity() {
  return (
    <>
      <path d={TOOTH_PATH} />
      <circle cx="9.1" cy="7.4" r="1.5" fill="currentColor" stroke="none" />
    </>
  );
}

function Implant() {
  return (
    <>
      {/* 크라운 — 어금니 모양으로 가운데가 얕게 파인다 */}
      <path
        d="M12 3.9 C10.5 2.9 8.8 2.5 7.2 2.9 C4.9 3.5 3.6 5.5 3.8 8
           C3.9 9.3 5 10 6.6 10 H17.4 C19 10 20.1 9.3 20.2 8
           C20.4 5.5 19.1 3.5 16.8 2.9 C15.2 2.5 13.5 2.9 12 3.9 Z"
      />
      {/* 픽스처 — 위쪽 매끈한 지대주, 아래쪽 나사산 */}
      <path d="M8.8 10 H15.2 l-1 9.4 c-0.15 1.1 -0.9 1.8 -2.2 1.8 s-2.05 -0.7 -2.2 -1.8 Z" />
      <path d="M8.9 12.4 H15.1" />
      {/* 나사산 */}
      <path d="M9.3 14.7 H14.7 M9.6 16.9 H14.4 M9.9 19.1 H14.1" />
    </>
  );
}

function CrownInlay() {
  return (
    <>
      <path d={TOOTH_PATH} />
      {/* 보철물이 덮인 경계선 */}
      <path d="M4.3 9.6 C7.2 10.8 16.8 10.8 19.7 9.6" />
    </>
  );
}

function WisdomTooth() {
  return (
    <>
      <g transform="translate(0.2 3.4) scale(0.76)">
        <path d={TOOTH_PATH} />
      </g>
      {/* 발치 방향 */}
      <path d="M19.4 11 V4.8 M17.2 7 L19.4 4.8 L21.6 7" />
    </>
  );
}

function LaminateWhitening() {
  return (
    <>
      <g transform="translate(-1 1.6) scale(0.84)">
        <path d={TOOTH_PATH} />
      </g>
      {/* 반짝임 */}
      <path
        d="M18.6 3.2 l0.85 2.15 2.15 0.85 -2.15 0.85 -0.85 2.15 -0.85 -2.15 -2.15 -0.85 2.15 -0.85 Z"
        fill="currentColor"
        stroke="none"
      />
    </>
  );
}

function GumPrevention() {
  return (
    <g transform="rotate(-45 12 12)">
      {/* 손잡이 */}
      <path d="M3.6 12 H12.4" />
      {/* 헤드 */}
      <rect x="12" y="10.4" width="8.6" height="3.2" rx="1.6" />
      {/* 칫솔모 */}
      <rect x="13.6" y="6.6" width="5.6" height="3.8" rx="0.9" />
      <path d="M15.5 6.6 V10.4 M17.3 6.6 V10.4" />
    </g>
  );
}

const ICONS: Record<string, () => JSX.Element> = {
  cavity: Cavity,
  implant: Implant,
  'crown-inlay': CrownInlay,
  'wisdom-tooth': WisdomTooth,
  'laminate-whitening': LaminateWhitening,
  'gum-prevention': GumPrevention,
};

export function TopicIcon({ slug, className = 'w-8 h-8' }: Props) {
  const Icon = ICONS[slug];
  if (!Icon) return null;

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Icon />
    </svg>
  );
}
