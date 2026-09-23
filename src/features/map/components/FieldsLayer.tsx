import { useMemo, useState } from 'react';
import { Polygon, Tooltip } from 'react-leaflet';

import { useActiveField, useFields, useFieldsStore } from '@/features/fields';
import { usePointsUiStore } from '@/features/points';

import { toLatLngRings } from '../services/geometry';
import { FIELD_ACTIVE_STYLE, FIELD_HOVER_STYLE, FIELD_STYLE } from '../services/mapTheme';

export function FieldsLayer() {
  const fields = useFields();
  const activeField = useActiveField();
  const selectField = useFieldsStore((state) => state.selectField);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);

  // New position arrays on every render would make react-leaflet reset the outlines.
  const layers = useMemo(
    () => fields.map((field) => ({ field, positions: toLatLngRings(field.geometry) })),
    [fields],
  );

  return layers.map(({ field, positions }) => {
    const style =
      field.id === activeField.id
        ? FIELD_ACTIVE_STYLE
        : field.id === hoveredFieldId
          ? FIELD_HOVER_STYLE
          : FIELD_STYLE;

    return (
      <Polygon
        key={field.id}
        positions={positions}
        pathOptions={style}
        eventHandlers={{
          // In add mode a click on a field means "place a point here"; MapClickHandler handles it.
          // getState() rather than a subscription: the fields layer must not re-render on mode change.
          click: () => {
            if (usePointsUiStore.getState().mode === 'idle') selectField(field.id);
          },
          mouseover: () => setHoveredFieldId(field.id),
          mouseout: () => setHoveredFieldId(null),
        }}
      >
        <Tooltip sticky>{field.name}</Tooltip>
      </Polygon>
    );
  });
}
