import { POINT_TYPE_META, POINT_TYPES, PointTypeBadge } from '@/features/points';

export function PointTypeLegend() {
  return (
    <section
      aria-label="Типи точок"
      className="absolute bottom-6 left-3 z-[1000] rounded-md bg-white/95 px-3 py-2 text-xs shadow-md"
    >
      <ul className="space-y-1">
        {POINT_TYPES.map((type) => (
          <li key={type} className="flex items-center gap-2">
            <PointTypeBadge type={type} size={16} />
            {POINT_TYPE_META[type].label}
          </li>
        ))}
      </ul>
    </section>
  );
}
