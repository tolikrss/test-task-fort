import { divIcon, type DivIcon, type PointTuple } from 'leaflet';

import { POINT_TYPE_META, type PointType } from '@/features/points';

import { MAP_CLASSES, MAP_COLORS } from './mapTheme';

/** 28×36 pin outline with its tip at (14, 35). */
export const PIN_PATH = 'M14 35s12-11.3 12-21A12 12 0 0 0 2 14c0 9.7 12 21 12 21z';
export const ICON_SIZE: PointTuple = [28, 36];
export const ICON_ANCHOR: PointTuple = [14, 35];
export const POPUP_ANCHOR: PointTuple = [0, -30];

/** SVG wrapper shared by every pin: the pin outline plus whatever is drawn inside its head. */
function pinSvg(pinAttributes: string, content: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36" aria-hidden="true"><path d="${PIN_PATH}" ${pinAttributes}/>${content}</svg>`;
}

// A custom className replaces the default `leaflet-div-icon` (white square with a border).
// Inline SVG instead of PNG: no icon files that Vite cannot resolve from leaflet.css.
export const DRAFT_ICON: DivIcon = divIcon({
  className: MAP_CLASSES.marker,
  html: pinSvg(
    `fill="${MAP_COLORS.white}" stroke="${MAP_COLORS.brand}" stroke-width="2" stroke-dasharray="4 3"`,
    `<circle cx="14" cy="14" r="4" fill="${MAP_COLORS.brand}"/>`,
  ),
  iconSize: ICON_SIZE,
  iconAnchor: ICON_ANCHOR,
});

function pointPinSvg(color: string, glyph: string): string {
  // The 24×24 glyph is scaled to 14 px and centered in the pin head (14, 14).
  return pinSvg(
    `fill="${color}" stroke="${MAP_COLORS.white}" stroke-width="2"`,
    `<g transform="translate(7 7) scale(0.5833)" fill="none" stroke="${MAP_COLORS.white}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="${glyph}"/></g>`,
  );
}

const iconCache = new Map<string, DivIcon>();

/**
 * Cached: react-leaflet calls setIcon (rebuilding the marker DOM) whenever the icon
 * reference changes. One instance per (type, highlighted) pair — no needless rebuilds.
 */
export function getPointIcon(type: PointType, highlighted: boolean): DivIcon {
  const key = `${type}:${String(highlighted)}`;
  let icon = iconCache.get(key);

  if (!icon) {
    const { color, glyph } = POINT_TYPE_META[type];

    icon = divIcon({
      className: highlighted
        ? `${MAP_CLASSES.marker} ${MAP_CLASSES.markerHighlighted}`
        : MAP_CLASSES.marker,
      html: pointPinSvg(color, glyph),
      iconSize: ICON_SIZE,
      iconAnchor: ICON_ANCHOR,
      popupAnchor: POPUP_ANCHOR,
    });
    iconCache.set(key, icon);
  }

  return icon;
}
