import { POINT_TYPE_META, type PointType } from '../model';

interface PointTypeBadgeProps {
  type: PointType;
  size?: number;
}

/** Same icon and color as the map marker (POINT_TYPE_META). Decorative: the label sits next to it. */
export function PointTypeBadge({ type, size = 20 }: PointTypeBadgeProps) {
  const { color, glyph } = POINT_TYPE_META[type];
  const glyphSize = Math.round(size * 0.65);

  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: color, width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        width={glyphSize}
        height={glyphSize}
        fill="none"
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={glyph} />
      </svg>
    </span>
  );
}
