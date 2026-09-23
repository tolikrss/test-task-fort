import { useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';

import {
  PointDetails,
  POINT_TYPE_META,
  usePointsUiStore,
  useVisiblePoints,
} from '@/features/points';
import { useRefMap } from '@/shared/hooks/useRefMap';

import { getPointIcon } from '../services/pointIcon';

import type { Marker as LeafletMarker } from 'leaflet';

/** Minimum zoom used when a point is selected from the list. */
const FOCUS_MIN_ZOOM = 16;
const HIGHLIGHTED_Z_INDEX_OFFSET = 1000;

export function PointsLayer() {
  const map = useMap();
  const points = useVisiblePoints();
  const focus = usePointsUiStore((state) => state.focus);
  const focusPoint = usePointsUiStore((state) => state.focusPoint);
  const { get: getMarker, register: registerMarker } = useRefMap<LeafletMarker>();

  // Selection in the list → fly to the marker and open its popup.
  useEffect(() => {
    const marker = focus?.source === 'list' ? getMarker(focus.pointId) : undefined;

    // Explicit `undefined`: with `noImplicitReturns` an effect that sometimes returns cleanup must return on every path.
    if (!marker) return undefined;
    // Open the popup after the flight: its autoPan in the middle of flyTo interrupts the animation.
    const openPopup = () => marker.openPopup();

    map.once('moveend', openPopup);
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), FOCUS_MIN_ZOOM));

    return () => {
      map.off('moveend', openPopup);
    };
  }, [focus, map, getMarker]);

  return points.map((point) => {
    const isFocused = point.id === focus?.pointId;

    return (
      <Marker
        key={point.id}
        position={[point.lat, point.lng]}
        icon={getPointIcon(point.type, isFocused)}
        zIndexOffset={isFocused ? HIGHLIGHTED_Z_INDEX_OFFSET : 0}
        title={POINT_TYPE_META[point.type].label}
        eventHandlers={{ click: () => focusPoint(point.id, 'map') }}
        ref={registerMarker(point.id)}
      >
        <Popup>
          <PointDetails point={point} />
        </Popup>
      </Marker>
    );
  });
}
