import { formatCoordinates, formatMgrs } from '@/shared/lib/format';
import { toMgrs, type LatLng } from '@/shared/lib/geo';

interface PointCoordinatesProps {
  latLng: LatLng;
}

/** MGRS is not stored but computed from lat/lng on display — a single source of truth. */
export function PointCoordinates({ latLng }: PointCoordinatesProps) {
  const mgrs = toMgrs(latLng);

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
      <dt className="text-slate-500">WGS 84</dt>
      <dd className="font-mono tabular-nums">{formatCoordinates(latLng)}</dd>
      <dt className="text-slate-500">MGRS</dt>
      <dd className="font-mono">{mgrs ? formatMgrs(mgrs) : '—'}</dd>
    </dl>
  );
}
