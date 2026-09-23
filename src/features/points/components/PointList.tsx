import { useEffect, useMemo } from 'react';

import { useFields } from '@/features/fields';
import { useRefMap } from '@/shared/hooks/useRefMap';
import { cn } from '@/shared/lib/cn';
import { IconButton } from '@/shared/ui/controls';

import { POINT_TYPE_META, type MonitoringPoint } from '../model';
import { usePointsUiStore } from '../store/pointsUiStore';

import { PointCreatedAt, PointDescription } from './PointMeta';
import { PointTypeBadge } from './PointTypeBadge';

interface PointListProps {
  points: readonly MonitoringPoint[];
  /** Show the field name in each row (when the list contains points from several fields). */
  showFieldName: boolean;
  /** Called after a point is selected — e.g. to close the drawer and reveal the map. */
  onPointActivate?: () => void;
}

export function PointList({ points, showFieldName, onPointActivate }: PointListProps) {
  const focus = usePointsUiStore((state) => state.focus);
  const focusPoint = usePointsUiStore((state) => state.focusPoint);
  const requestDelete = usePointsUiStore((state) => state.requestDelete);
  const fields = useFields();
  const fieldNames = useMemo(() => new Map(fields.map((f) => [f.id, f.name])), [fields]);
  const { get: getRow, register: registerRow } = useRefMap<HTMLLIElement>();

  // Marker click → scroll the list to the matching row.
  useEffect(() => {
    if (focus?.source !== 'map') return;

    getRow(focus.pointId)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [focus, getRow]);

  return (
    <ul className="divide-y divide-slate-100">
      {points.map((point) => {
        const isFocused = point.id === focus?.pointId;
        const { label } = POINT_TYPE_META[point.type];

        return (
          <li
            key={point.id}
            ref={registerRow(point.id)}
            className={cn('flex items-start gap-1 rounded-md', isFocused && 'bg-brand-50')}
          >
            <button
              type="button"
              aria-current={isFocused ? 'true' : undefined}
              onClick={() => {
                focusPoint(point.id, 'list');
                onPointActivate?.();
              }}
              className="flex min-w-0 flex-1 items-start gap-3 rounded-md p-2 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-brand-600"
            >
              <PointTypeBadge type={point.type} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{label}</span>
                <PointDescription
                  description={point.description}
                  className="block truncate text-sm"
                />
                <span className="block text-xs text-slate-500">
                  <PointCreatedAt createdAt={point.createdAt} />
                  {showFieldName && ` · ${fieldNames.get(point.fieldId) ?? 'Невідоме поле'}`}
                </span>
              </span>
            </button>
            <IconButton
              label={`Видалити точку «${label}»`}
              icon="✕"
              onClick={() => requestDelete(point.id)}
              className="mt-1"
            />
          </li>
        );
      })}
    </ul>
  );
}
