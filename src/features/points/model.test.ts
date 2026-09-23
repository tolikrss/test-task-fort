import { describe, expect, it } from 'vitest';

import {
  DEFAULT_POINT_FILTERS,
  DESCRIPTION_MAX_LENGTH,
  hasActiveFilters,
  monitoringPointSchema,
  pointFormSchema,
} from './model';

import { makePoint } from '@/test/fixtures';

const VALID_POINT = makePoint();

describe('pointFormSchema', () => {
  it('requires a point type', () => {
    const result = pointFormSchema.safeParse({ type: '', description: '' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Оберіть тип точки');
  });

  it('trims whitespace in the description', () => {
    expect(pointFormSchema.parse({ type: 'pests', description: '  Aphids  ' })).toEqual({
      type: 'pests',
      description: 'Aphids',
    });
  });

  it('turns a whitespace-only description into undefined', () => {
    expect(
      pointFormSchema.parse({ type: 'other', description: '   ' }).description,
    ).toBeUndefined();
  });

  it('limits the description length', () => {
    const ok = 'a'.repeat(DESCRIPTION_MAX_LENGTH);

    expect(pointFormSchema.safeParse({ type: 'soil', description: ok }).success).toBe(true);
    expect(pointFormSchema.safeParse({ type: 'soil', description: `${ok}a` }).success).toBe(false);
  });
});

describe('monitoringPointSchema', () => {
  it('accepts a valid point', () => {
    expect(monitoringPointSchema.safeParse(VALID_POINT).success).toBe(true);
  });

  it('rejects an unknown type', () => {
    expect(monitoringPointSchema.safeParse({ ...VALID_POINT, type: 'weeds' }).success).toBe(false);
  });

  it('rejects latitude outside [-90, 90]', () => {
    expect(monitoringPointSchema.safeParse({ ...VALID_POINT, lat: 91 }).success).toBe(false);
  });

  it('rejects a non-ISO 8601 date', () => {
    expect(
      monitoringPointSchema.safeParse({ ...VALID_POINT, createdAt: 'yesterday' }).success,
    ).toBe(false);
  });
});

describe('hasActiveFilters', () => {
  it('is false for the default filters', () => {
    expect(hasActiveFilters(DEFAULT_POINT_FILTERS)).toBe(false);
  });

  it('is true when a filter hides points', () => {
    expect(hasActiveFilters({ ...DEFAULT_POINT_FILTERS, type: 'pests' })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_POINT_FILTERS, query: 'beetle' })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_POINT_FILTERS, scope: 'field' })).toBe(true);
  });

  it('ignores a whitespace-only query', () => {
    expect(hasActiveFilters({ ...DEFAULT_POINT_FILTERS, query: '   ' })).toBe(false);
  });

  it('ignores sorting because it only reorders points', () => {
    expect(hasActiveFilters({ ...DEFAULT_POINT_FILTERS, sort: 'oldest' })).toBe(false);
  });
});
