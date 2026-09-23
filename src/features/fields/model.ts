import { z } from 'zod';

import { polygonAreaHa } from '@/shared/lib/geo';

import type { NonEmptyArray } from '@/shared/lib/types';

/** GeoJSON position: [lng, lat] (no altitude). */
const positionSchema = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);

const linearRingSchema = z
  .array(positionSchema)
  .min(4, 'Контур має містити щонайменше 4 точки')
  .refine((ring) => {
    const first = ring[0];
    const last = ring.at(-1);

    return (
      first !== undefined && last !== undefined && first[0] === last[0] && first[1] === last[1]
    );
  }, 'Контур має бути замкненим: перша й остання точки збігаються');

const polygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(linearRingSchema).min(1),
});

const fieldFeatureSchema = z.object({
  type: z.literal('Feature'),
  properties: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    area: z.number().positive(),
    crop: z.string().min(1),
  }),
  geometry: polygonSchema,
});

const fieldCollectionSchema = z
  .object({
    type: z.literal('FeatureCollection'),
    // A tuple with a rest element yields [Feature, ...Feature[]] — the compiler guarantees at least one field
    features: z.tuple([fieldFeatureSchema], fieldFeatureSchema, {
      error: 'Потрібне хоча б одне поле',
    }),
  })
  .refine(
    ({ features }) => new Set(features.map((f) => f.properties.id)).size === features.length,
    'Ідентифікатори полів мають бути унікальними',
  );

type FieldFeature = z.infer<typeof fieldFeatureSchema>;

export type FieldGeometry = z.infer<typeof polygonSchema>;

export interface Field {
  id: string;
  name: string;
  crop: string;
  /** Area computed from the outline, ha. This is what the UI shows. */
  areaHa: number;
  /** Area from `properties.area` — for reference, may not match the outline. */
  declaredAreaHa: number;
  geometry: FieldGeometry;
}

export class FieldsDataError extends Error {
  override name = 'FieldsDataError';
}

function toField({ properties, geometry }: FieldFeature): Field {
  return {
    id: properties.id,
    name: properties.name,
    crop: properties.crop,
    areaHa: polygonAreaHa(geometry),
    declaredAreaHa: properties.area,
    geometry,
  };
}

export function parseFields(data: unknown): NonEmptyArray<Field> {
  const result = fieldCollectionSchema.safeParse(data);

  if (!result.success) {
    throw new FieldsDataError(`Некоректні дані полів:\n${z.prettifyError(result.error)}`);
  }

  const [first, ...rest] = result.data.features;

  return [toField(first), ...rest.map(toField)];
}
