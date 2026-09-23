import { useId } from 'react';

import { Button } from '@/shared/ui/controls';
import { EmptyState } from '@/shared/ui/empty-state';

import { useVisiblePoints } from '../hooks/useVisiblePoints';
import { hasActiveFilters } from '../model';
import { usePointsUiStore } from '../store/pointsUiStore';

import { PointFilters } from './PointFilters';
import { PointList } from './PointList';

interface PointsPanelProps {
  onPointActivate?: () => void;
}

export function PointsPanel({ onPointActivate }: PointsPanelProps) {
  const points = useVisiblePoints();
  const filters = usePointsUiStore((state) => state.filters);
  const resetFilters = usePointsUiStore((state) => state.resetFilters);
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h2 id={headingId} className="text-sm font-semibold text-slate-700">
        Точки <span className="font-normal text-slate-500">({points.length})</span>
      </h2>
      <PointFilters />
      {points.length > 0 ? (
        <PointList
          points={points}
          showFieldName={filters.scope === 'all'}
          onPointActivate={onPointActivate}
        />
      ) : hasActiveFilters(filters) ? (
        <EmptyState
          title="Нічого не знайдено"
          description="Спробуйте змінити фільтри або пошуковий запит."
          action={
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              Скинути фільтри
            </Button>
          }
        />
      ) : (
        <EmptyState
          title="Точок ще немає"
          description="Натисніть «+ Додати точку» на карті й клікніть у межах поля."
        />
      )}
    </section>
  );
}
