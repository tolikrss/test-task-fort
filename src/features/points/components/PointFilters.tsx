import { controlClassName, FormField } from '@/shared/ui/controls';

import {
  POINT_TYPE_META,
  POINT_TYPES,
  pointTypeSchema,
  type PointFilters as Filters,
} from '../model';
import { usePointsUiStore } from '../store/pointsUiStore';

/** <select> value → filter type without `as`: an unknown value means "all types". */
function parseTypeFilter(value: string): Filters['type'] {
  const result = pointTypeSchema.safeParse(value);

  return result.success ? result.data : 'all';
}

export function PointFilters() {
  const filters = usePointsUiStore((state) => state.filters);
  const setFilters = usePointsUiStore((state) => state.setFilters);
  const searchText = usePointsUiStore((state) => state.searchText);
  const setSearchText = usePointsUiStore((state) => state.setSearchText);

  return (
    <search className="space-y-2">
      <FormField label="Пошук за описом" hideLabel>
        {(fieldProps) => (
          <input
            {...fieldProps}
            type="search"
            placeholder="Пошук за описом…"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            className={controlClassName}
          />
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-2">
        <FormField label="Тип">
          {(fieldProps) => (
            <select
              {...fieldProps}
              value={filters.type}
              onChange={(event) => setFilters({ type: parseTypeFilter(event.target.value) })}
              className={controlClassName}
            >
              <option value="all">Усі типи</option>
              {POINT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {POINT_TYPE_META[type].label}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField label="Сортування">
          {(fieldProps) => (
            <select
              {...fieldProps}
              value={filters.sort}
              onChange={(event) =>
                setFilters({ sort: event.target.value === 'oldest' ? 'oldest' : 'newest' })
              }
              className={controlClassName}
            >
              <option value="newest">Спершу нові</option>
              <option value="oldest">Спершу старі</option>
            </select>
          )}
        </FormField>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={filters.scope === 'field'}
          onChange={(event) => setFilters({ scope: event.target.checked ? 'field' : 'all' })}
          className="size-4 accent-brand-600"
        />
        Лише активне поле
      </label>
    </search>
  );
}
