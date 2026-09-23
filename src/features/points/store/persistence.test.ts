import { describe, expect, it } from 'vitest';

import { makePoint } from '@/test/fixtures';

import { sanitizePersistedPoints } from './persistence';

const VALID_POINT = makePoint();

describe('sanitizePersistedPoints', () => {
  it('empty state (first launch) — no points and no error', () => {
    expect(sanitizePersistedPoints(undefined)).toEqual({ points: [], hadInvalidData: false });
  });

  it('keeps valid points', () => {
    expect(sanitizePersistedPoints({ points: [VALID_POINT] })).toEqual({
      points: [VALID_POINT],
      hadInvalidData: false,
    });
  });

  it('drops invalid records and keeps valid ones', () => {
    const result = sanitizePersistedPoints({
      points: [VALID_POINT, { ...VALID_POINT, id: 'p-2', type: 'weeds' }, 'garbage'],
    });

    expect(result).toEqual({ points: [VALID_POINT], hadInvalidData: true });
  });

  it('foreign shape — no points, reports an error', () => {
    expect(sanitizePersistedPoints(42)).toEqual({ points: [], hadInvalidData: true });
    expect(sanitizePersistedPoints({ points: 'not an array' })).toEqual({
      points: [],
      hadInvalidData: true,
    });
  });
});
