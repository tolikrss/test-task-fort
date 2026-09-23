import { Button } from '@/shared/ui/controls';

import { POINT_TYPE_META, type MonitoringPoint } from '../model';
import { usePointsUiStore } from '../store/pointsUiStore';

import { PointCoordinates } from './PointCoordinates';
import { PointCreatedAt, PointDescription } from './PointMeta';
import { PointTypeBadge } from './PointTypeBadge';

interface PointDetailsProps {
  point: MonitoringPoint;
}

/** Marker popup content. Only divs, no <p>: leaflet.css gives popup paragraphs large margins. */
export function PointDetails({ point }: PointDetailsProps) {
  const requestDelete = usePointsUiStore((state) => state.requestDelete);

  return (
    <div className="w-60 space-y-2 text-sm">
      <div className="flex items-center gap-2 font-semibold">
        <PointTypeBadge type={point.type} />
        {POINT_TYPE_META[point.type].label}
      </div>
      <PointDescription description={point.description} className="block" />
      <PointCoordinates latLng={point} />
      <div className="text-xs text-slate-500">
        Створено: <PointCreatedAt createdAt={point.createdAt} />
      </div>
      <Button variant="danger" size="sm" onClick={() => requestDelete(point.id)}>
        Видалити
      </Button>
    </div>
  );
}
