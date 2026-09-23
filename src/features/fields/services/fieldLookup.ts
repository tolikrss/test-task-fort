import { isPointInPolygon, type LatLng } from '@/shared/lib/geo';

import { getFields } from './fieldsData';

import type { Field } from '../model';

/** The field that contains the point, if any. Sample fields do not overlap, so the first match wins. */
export function findFieldAt(
  point: LatLng,
  fields: readonly Field[] = getFields(),
): Field | undefined {
  return fields.find((field) => isPointInPolygon(point, field.geometry));
}
