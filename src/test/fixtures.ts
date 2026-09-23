import type { FieldGeometry } from '@/features/fields';
import type { MonitoringPoint } from '@/features/points';

/** A valid point; tests override only the fields they care about. */
export function makePoint(overrides: Partial<MonitoringPoint> = {}): MonitoringPoint {
  return {
    id: 'p-1',
    fieldId: 'field-1',
    lat: 50.455,
    lng: 30.528,
    type: 'soil',
    createdAt: '2026-09-01T10:00:00.000Z',
    ...overrides,
  };
}

/** The square field from the example in the assignment (≈ 78.7 ha), as a closed [lng, lat] ring. */
export const SQUARE_FIELD: FieldGeometry = {
  type: 'Polygon',
  coordinates: [
    [
      [30.5234, 50.4501],
      [30.5334, 50.4501],
      [30.5334, 50.4601],
      [30.5234, 50.4601],
      [30.5234, 50.4501],
    ],
  ],
};
