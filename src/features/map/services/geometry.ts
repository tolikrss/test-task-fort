import type { FieldGeometry } from '@/features/fields';
import type { LatLngBoundsLiteral, LatLngTuple } from 'leaflet';

/** GeoJSON stores [lng, lat], Leaflet expects [lat, lng]. */
export function toLatLngRings(geometry: FieldGeometry): LatLngTuple[][] {
  return geometry.coordinates.map((ring) => ring.map(([lng, lat]): LatLngTuple => [lat, lng]));
}

/** Bounds without creating L.LatLngBounds — a pure function, testable without the DOM. */
export function boundsOf(geometries: readonly FieldGeometry[]): LatLngBoundsLiteral {
  let south = Infinity;
  let west = Infinity;
  let north = -Infinity;
  let east = -Infinity;

  for (const geometry of geometries) {
    for (const ring of geometry.coordinates) {
      for (const [lng, lat] of ring) {
        south = Math.min(south, lat);
        north = Math.max(north, lat);
        west = Math.min(west, lng);
        east = Math.max(east, lng);
      }
    }
  }

  return [
    [south, west],
    [north, east],
  ];
}
