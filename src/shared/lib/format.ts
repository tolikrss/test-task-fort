import type { LatLng } from './geo';

const LOCALE = 'uk-UA';

const areaFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

/** 6 decimals ≈ 0.1 m — finer than any field GPS, shorter than a raw float. */
const COORDINATE_DECIMALS = 6;

/** Zone (1–60 + band letter) · 100 km square · easting/northing digits split evenly. */
const MGRS_PATTERN = /^(\d{1,2}[C-X])([A-Z]{2})(\d*)$/;

export function formatAreaHa(areaHa: number): string {
  return `${areaFormatter.format(areaHa)} га`;
}

/** Coordinates use a dot, not a comma, so they paste into any geo service. */
export function formatCoordinates({ lat, lng }: LatLng): string {
  return `${lat.toFixed(COORDINATE_DECIMALS)}, ${lng.toFixed(COORDINATE_DECIMALS)}`;
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

/** '36UUA2455592151' → '36U UA 24555 92151' */
export function formatMgrs(mgrs: string): string {
  const match = MGRS_PATTERN.exec(mgrs);

  if (!match) return mgrs;
  const [, zone, square, digits = ''] = match;
  const half = digits.length / 2;

  return [zone, square, digits.slice(0, half), digits.slice(half)].filter(Boolean).join(' ');
}
