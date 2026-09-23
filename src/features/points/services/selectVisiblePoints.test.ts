import { describe, expect, it } from 'vitest';

import { DEFAULT_POINT_FILTERS, type MonitoringPoint, type PointFilters } from '../model';

import { makePoint as point } from '@/test/fixtures';

import { selectVisiblePoints } from './selectVisiblePoints';

const POINTS: MonitoringPoint[] = [
  point({
    id: 'a',
    type: 'soil',
    description: 'Кисла ҐРУНТОВА проба',
    createdAt: '2026-09-01T10:00:00.000Z',
  }),
  point({
    id: 'b',
    type: 'pests',
    description: 'Aphids on leaves',
    createdAt: '2026-09-03T10:00:00.000Z',
  }),
  point({ id: 'c', type: 'disease', createdAt: '2026-09-02T10:00:00.000Z' }),
  point({
    id: 'd',
    fieldId: 'field-2',
    type: 'pests',
    description: 'Colorado beetle',
    createdAt: '2026-09-04T10:00:00.000Z',
  }),
];

function visibleIds(filters: Partial<PointFilters>, points = POINTS): string[] {
  return selectVisiblePoints(points, { ...DEFAULT_POINT_FILTERS, ...filters }, 'field-1').map(
    (p) => p.id,
  );
}

describe('selectVisiblePoints', () => {
  it('shows points of all fields by default, newest first', () => {
    expect(visibleIds({})).toEqual(['d', 'b', 'c', 'a']);
  });

  it('scope field narrows the list to the active field', () => {
    expect(visibleIds({ scope: 'field' })).toEqual(['b', 'c', 'a']);
  });

  it('filters by type', () => {
    expect(visibleIds({ type: 'pests' })).toEqual(['d', 'b']);
  });

  it('searches descriptions ignoring case and surrounding spaces, including the Ukrainian letter ghe (U+0491)', () => {
    expect(visibleIds({ query: '  ґрунтова ' })).toEqual(['a']);
  });

  it('points without a description never match a non-empty query', () => {
    expect(visibleIds({ query: 'on' })).toEqual(['b']);
  });

  it('sorts oldest first', () => {
    expect(visibleIds({ sort: 'oldest' })).toEqual(['a', 'c', 'b', 'd']);
  });

  it('keeps insertion order for equal timestamps in both directions', () => {
    const sameTime = [
      point({ id: 'x', createdAt: '2026-09-01T10:00:00.000Z' }),
      point({ id: 'y', createdAt: '2026-09-01T10:00:00.000Z' }),
    ];

    expect(visibleIds({ sort: 'oldest' }, sameTime)).toEqual(['x', 'y']);
    expect(visibleIds({ sort: 'newest' }, sameTime)).toEqual(['x', 'y']);
  });

  it('does not mutate the input array', () => {
    const input = [...POINTS];

    selectVisiblePoints(input, { ...DEFAULT_POINT_FILTERS, sort: 'oldest' }, 'field-1');
    expect(input).toEqual(POINTS);
  });
});
