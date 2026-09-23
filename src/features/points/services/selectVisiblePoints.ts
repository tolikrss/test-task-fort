import type { MonitoringPoint, PointFilters } from '../model';

const LOCALE = 'uk-UA';

/**
 * Pure function: the list and the map show the same result,
 * and the logic can be tested without React or the store.
 */
export function selectVisiblePoints(
  points: readonly MonitoringPoint[],
  filters: PointFilters,
  activeFieldId: string,
): MonitoringPoint[] {
  const query = filters.query.trim().toLocaleLowerCase(LOCALE);
  const direction = filters.sort === 'newest' ? -1 : 1;

  return (
    points
      .filter((point) => filters.scope === 'all' || point.fieldId === activeFieldId)
      .filter((point) => filters.type === 'all' || point.type === filters.type)
      .filter(
        (point) =>
          query === '' || (point.description?.toLocaleLowerCase(LOCALE).includes(query) ?? false),
      )
      // toSorted is stable and does not mutate the input: points with equal timestamps keep insertion order.
      .toSorted((a, b) => direction * (Date.parse(a.createdAt) - Date.parse(b.createdAt)))
  );
}
