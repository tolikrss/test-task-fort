import type { PathOptions } from 'leaflet';

/**
 * Hex values mirroring the brand-* and slate-* tokens in index.css: Leaflet draws SVG outside
 * Tailwind, so the map needs literal colors. Keep both places in sync.
 */
export const MAP_COLORS = {
  brand: '#15803d',
  brandFill: '#22c55e',
  field: '#64748b',
  fieldHover: '#334155',
  fieldFill: '#94a3b8',
  white: '#ffffff',
} as const;

/** CSS classes defined in index.css and toggled from TS. */
export const MAP_CLASSES = {
  addingMode: 'map-adding',
  marker: 'point-marker',
  markerHighlighted: 'point-marker--highlighted',
} as const;

export const FIELD_STYLE: PathOptions = {
  color: MAP_COLORS.field,
  weight: 2,
  fillColor: MAP_COLORS.fieldFill,
  fillOpacity: 0.25,
};

export const FIELD_HOVER_STYLE: PathOptions = {
  ...FIELD_STYLE,
  color: MAP_COLORS.fieldHover,
  fillOpacity: 0.4,
};

export const FIELD_ACTIVE_STYLE: PathOptions = {
  color: MAP_COLORS.brand,
  weight: 3,
  fillColor: MAP_COLORS.brandFill,
  fillOpacity: 0.3,
};
