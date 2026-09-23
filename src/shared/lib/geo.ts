import { area } from '@turf/area';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import { forward } from 'mgrs';

import type { Polygon } from 'geojson';

/**
 * The only place the app touches Turf and mgrs: the rest of the code works with `LatLng`
 * and does not need to know that GeoJSON stores coordinates as [lng, lat].
 */
export interface LatLng {
  lat: number;
  lng: number;
}

const SQUARE_METERS_PER_HECTARE = 10_000;

/** MGRS is built on UTM, which is defined only between 80°S and 84°N. */
const MGRS_MIN_LAT = -80;
const MGRS_MAX_LAT = 84;

/** 5 digits per axis = 1 m precision. */
const MGRS_ACCURACY_DIGITS = 5;

export function polygonAreaHa(polygon: Polygon): number {
  return area(polygon) / SQUARE_METERS_PER_HECTARE;
}

/** The boundary counts as inside: a click exactly on the outline must not be rejected. */
export function isPointInPolygon({ lat, lng }: LatLng, polygon: Polygon): boolean {
  return booleanPointInPolygon([lng, lat], polygon);
}

export function toMgrs({ lat, lng }: LatLng): string | null {
  if (lat < MGRS_MIN_LAT || lat > MGRS_MAX_LAT) return null;
  try {
    return forward([lng, lat], MGRS_ACCURACY_DIGITS);
  } catch (error) {
    console.warn('[geo] Failed to compute MGRS', error);

    return null;
  }
}
