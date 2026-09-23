import { describe, expect, it } from 'vitest';

import { isPointInPolygon, polygonAreaHa, toMgrs } from './geo';

import { SQUARE_FIELD as SQUARE } from '@/test/fixtures';

import type { Polygon } from 'geojson';

// L-shaped (concave) field: notch in the top-right corner
const L_SHAPE: Polygon = {
  type: 'Polygon',
  coordinates: [
    [
      [30.5234, 50.464],
      [30.54, 50.464],
      [30.54, 50.468],
      [30.53, 50.468],
      [30.53, 50.474],
      [30.5234, 50.474],
      [30.5234, 50.464],
    ],
  ],
};

describe('polygonAreaHa', () => {
  it('computes geodesic area in hectares', () => {
    expect(polygonAreaHa(SQUARE)).toBeCloseTo(78.72, 1);
  });
});

describe('isPointInPolygon', () => {
  it('is true for a point inside the field', () => {
    expect(isPointInPolygon({ lat: 50.4551, lng: 30.5284 }, SQUARE)).toBe(true);
  });

  it('is false for a point outside the field', () => {
    expect(isPointInPolygon({ lat: 50.47, lng: 30.5284 }, SQUARE)).toBe(false);
  });

  it('treats the field boundary as inside', () => {
    expect(isPointInPolygon({ lat: 50.455, lng: 30.5234 }, SQUARE)).toBe(true);
  });

  it('is false in the notch of a concave field even inside its bounding box', () => {
    expect(isPointInPolygon({ lat: 50.471, lng: 30.535 }, L_SHAPE)).toBe(false);
  });

  it('is true in the leg of a concave field', () => {
    expect(isPointInPolygon({ lat: 50.47, lng: 30.526 }, L_SHAPE)).toBe(true);
  });
});

describe('toMgrs', () => {
  it('converts WGS84 to MGRS with 1 m precision', () => {
    expect(toMgrs({ lat: 50.4551, lng: 30.5284 })).toBe('36UUA2455592151');
  });

  it('returns null in polar zones where MGRS (UTM) is undefined', () => {
    expect(toMgrs({ lat: 85, lng: 0 })).toBeNull();
    expect(toMgrs({ lat: -81, lng: 0 })).toBeNull();
  });
});
