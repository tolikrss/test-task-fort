import { useMapEvents } from 'react-leaflet';

import { findFieldAt, useActiveField, useFields, useFieldsStore } from '@/features/fields';
import { usePointsUiStore } from '@/features/points';
import { showToast } from '@/shared/ui/toast';

/**
 * In add mode turns a map click into a point draft inside any field. A click on another field
 * makes it active; a click outside every field is rejected.
 */
export function MapClickHandler() {
  const fields = useFields();
  const activeField = useActiveField();
  const selectField = useFieldsStore((state) => state.selectField);
  const mode = usePointsUiStore((state) => state.mode);
  const setDraft = usePointsUiStore((state) => state.setDraft);

  useMapEvents({
    click(event) {
      if (mode !== 'adding') return;

      const latLng = { lat: event.latlng.lat, lng: event.latlng.lng };
      const field = findFieldAt(latLng, fields);

      if (!field) {
        showToast({
          id: 'point-outside-field',
          tone: 'error',
          message: 'Точка має бути в межах одного з полів',
        });

        return;
      }

      // Draft first: the field-change subscription keeps a draft that lies inside the new field.
      setDraft(latLng);

      if (field.id !== activeField.id) selectField(field.id);
    },
  });

  return null;
}
