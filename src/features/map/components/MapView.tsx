import { useMemo } from 'react';
import { MapContainer } from 'react-leaflet';

import { useFields } from '@/features/fields';
import { usePointsUiStore } from '@/features/points';
import { cn } from '@/shared/lib/cn';

import { ActiveFieldFocus } from './ActiveFieldFocus';
import { AddPointControl } from './AddPointControl';
import { BaseTileLayer } from './BaseTileLayer';
import { DraftMarker } from './DraftMarker';
import { FieldsLayer } from './FieldsLayer';
import { boundsOf } from '../services/geometry';
import { MAP_CLASSES } from '../services/mapTheme';
import { MapClickHandler } from './MapClickHandler';
import { PointsLayer } from './PointsLayer';
import { PointTypeLegend } from './PointTypeLegend';

import type { PointTuple } from 'leaflet';

const MAP_PADDING: PointTuple = [32, 32];

export function MapView() {
  const fields = useFields();
  const isAdding = usePointsUiStore((state) => state.mode === 'adding');
  // MapContainer reads bounds only when the map is created; ActiveFieldFocus drives the camera after that.
  const bounds = useMemo(() => boundsOf(fields.map((field) => field.geometry)), [fields]);

  return (
    // The mode class sits on the wrapper: MapContainer's own className is immutable after creation,
    // and React overwriting it would wipe the classes Leaflet adds.
    <div className={cn('relative h-full', isAdding && MAP_CLASSES.addingMode)}>
      <MapContainer
        bounds={bounds}
        boundsOptions={{ padding: MAP_PADDING }}
        className="h-full w-full"
      >
        <BaseTileLayer />
        <FieldsLayer />
        <PointsLayer />
        <DraftMarker />
        <MapClickHandler />
        <ActiveFieldFocus />
      </MapContainer>
      <AddPointControl />
      <PointTypeLegend />
    </div>
  );
}
