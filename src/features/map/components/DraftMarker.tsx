import { Marker } from 'react-leaflet';

import { usePointsUiStore } from '@/features/points';

import { DRAFT_ICON } from '../services/pointIcon';

export function DraftMarker() {
  const draft = usePointsUiStore((state) => state.draft);

  if (!draft) return null;

  return (
    <Marker
      position={[draft.lat, draft.lng]}
      icon={DRAFT_ICON}
      interactive={false}
      keyboard={false}
    />
  );
}
