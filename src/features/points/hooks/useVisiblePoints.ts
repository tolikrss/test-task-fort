import { useMemo } from 'react';

import { useActiveField } from '@/features/fields';

import { selectVisiblePoints } from '../services/selectVisiblePoints';
import { usePointsStore } from '../store/pointsStore';
import { usePointsUiStore } from '../store/pointsUiStore';

import type { MonitoringPoint } from '../model';

/** Points after filters, search and sorting. The map and the list show the same set. */
export function useVisiblePoints(): MonitoringPoint[] {
  const points = usePointsStore((state) => state.points);
  const filters = usePointsUiStore((state) => state.filters);
  const activeFieldId = useActiveField().id;

  return useMemo(
    () => selectVisiblePoints(points, filters, activeFieldId),
    [points, filters, activeFieldId],
  );
}
