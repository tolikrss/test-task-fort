import { describe, expect, it } from 'vitest';

import { boundsOf, toLatLngRings } from './geometry';

import { SQUARE_FIELD as SQUARE } from '@/test/fixtures';

import type { FieldGeometry } from '@/features/fields';

const FAR: FieldGeometry = {
  type: 'Polygon',
  coordinates: [
    [
      [30.6, 50.5],
      [30.61, 50.5],
      [30.61, 50.51],
      [30.6, 50.5],
    ],
  ],
};

describe('toLatLngRings', () => {
  it('swaps GeoJSON [lng, lat] to Leaflet [lat, lng]', () => {
    expect(toLatLngRings(SQUARE)[0]?.[0]).toEqual([50.4501, 30.5234]);
  });
});

describe('boundsOf', () => {
  it('returns [[south, west], [north, east]] for one polygon', () => {
    expect(boundsOf([SQUARE])).toEqual([
      [50.4501, 30.5234],
      [50.4601, 30.5334],
    ]);
  });

  it('merges the bounds of several polygons', () => {
    expect(boundsOf([SQUARE, FAR])).toEqual([
      [50.4501, 30.5234],
      [50.51, 30.61],
    ]);
  });
});
