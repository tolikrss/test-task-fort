import { describe, expect, it } from 'vitest';

import { formatAreaHa, formatCoordinates, formatMgrs } from './format';

describe('formatAreaHa', () => {
  it('formats area with one decimal in the Ukrainian locale', () => {
    expect(formatAreaHa(78.7217)).toBe('78,7 га');
    expect(formatAreaHa(5)).toBe('5,0 га');
  });
});

describe('formatCoordinates', () => {
  it('prints lat, lng with 6 decimals', () => {
    expect(formatCoordinates({ lat: 50.4551, lng: 30.5284 })).toBe('50.455100, 30.528400');
  });
});

describe('formatMgrs', () => {
  it('splits MGRS into zone, square and coordinates', () => {
    expect(formatMgrs('36UUA2455592151')).toBe('36U UA 24555 92151');
  });

  it('returns the string unchanged when it is not MGRS', () => {
    expect(formatMgrs('not-mgrs')).toBe('not-mgrs');
  });
});
