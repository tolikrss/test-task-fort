import { z } from 'zod';

export const POINT_TYPES = ['soil', 'pests', 'disease', 'other'] as const;

export const pointTypeSchema = z.enum(POINT_TYPES);

export type PointType = z.infer<typeof pointTypeSchema>;

export interface PointTypeMeta {
  label: string;
  /** Hex, because the color is also needed in the Leaflet marker SVG string, not only in Tailwind. */
  color: string;
  /** SVG path `d` attribute in a 24×24 coordinate system (stroke, no fill). */
  glyph: string;
}

/** Record guarantees at compile time that every type has a label, color and icon. */
export const POINT_TYPE_META: Record<PointType, PointTypeMeta> = {
  soil: { label: 'Проба ґрунту', color: '#a16207', glyph: 'M4 9h16M4 13h16M4 17h16' },
  pests: {
    label: 'Шкідники',
    color: '#dc2626',
    glyph:
      'M12 7a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3zM9 11H5m14 0h-4m-6 4H5m14 0h-4M10 5 9 3m5 2 1-2',
  },
  disease: {
    label: 'Хвороби рослин',
    color: '#7c3aed',
    glyph: 'M5 19c0-8 6-14 14-14 0 8-6 14-14 14zm0 0 7-7',
  },
  other: { label: 'Інше', color: '#0284c7', glyph: 'M12 7v6m0 4h.01' },
};

export const DESCRIPTION_MAX_LENGTH = 500;

/** Stored point schema: used to validate data coming from localStorage. */
export const monitoringPointSchema = z.object({
  id: z.string().min(1),
  fieldId: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  type: pointTypeSchema,
  description: z.string().max(DESCRIPTION_MAX_LENGTH).optional(),
  createdAt: z.iso.datetime(),
});

export type MonitoringPoint = z.infer<typeof monitoringPointSchema>;

export type NewPointInput = Omit<MonitoringPoint, 'id' | 'createdAt'>;

export const pointFormSchema = z.object({
  // Input is the <select> string (empty until a type is chosen), output is PointType.
  type: z.string().pipe(z.enum(POINT_TYPES, { error: 'Оберіть тип точки' })),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH, `Опис — до ${DESCRIPTION_MAX_LENGTH} символів`)
    // An empty description is not stored: the list shows a placeholder instead of a blank line.
    .transform((value) => (value === '' ? undefined : value)),
});

export type PointFormInput = z.input<typeof pointFormSchema>;
export type PointFormValues = z.output<typeof pointFormSchema>;

export interface PointFilters {
  type: PointType | 'all';
  query: string;
  sort: 'newest' | 'oldest';
  /** 'all' — points of every field (requirement: list all added points); 'field' — active field only. */
  scope: 'field' | 'all';
}

export const DEFAULT_POINT_FILTERS: PointFilters = {
  type: 'all',
  query: '',
  sort: 'newest',
  scope: 'all',
};

/**
 * Whether any filter hides points compared with the defaults. Sorting is excluded because it only
 * reorders the list. Kept next to DEFAULT_POINT_FILTERS so a new filter is added in one place.
 */
export function hasActiveFilters(filters: PointFilters): boolean {
  return (
    filters.type !== DEFAULT_POINT_FILTERS.type ||
    filters.query.trim() !== DEFAULT_POINT_FILTERS.query ||
    filters.scope !== DEFAULT_POINT_FILTERS.scope
  );
}
