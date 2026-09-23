import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

import { useActiveField, useFieldsStore } from '@/features/fields';

import { boundsOf } from '../services/geometry';

import type { PointTuple } from 'leaflet';

const FIELD_PADDING: PointTuple = [48, 48];

/**
 * Flies to a field when the user selects it. On start (activeFieldId === null) the map
 * shows all fields. Compares against a ref instead of a "first run" flag: StrictMode's double
 * effect would otherwise trigger a flight right after load.
 */
export function ActiveFieldFocus() {
  const map = useMap();
  const activeFieldId = useFieldsStore((state) => state.activeFieldId);
  const activeField = useActiveField();
  const shownFieldId = useRef(activeFieldId);

  useEffect(() => {
    if (activeFieldId === null || shownFieldId.current === activeFieldId) return;
    shownFieldId.current = activeFieldId;
    map.flyToBounds(boundsOf([activeField.geometry]), { padding: FIELD_PADDING });
  }, [activeFieldId, activeField, map]);

  return null;
}
