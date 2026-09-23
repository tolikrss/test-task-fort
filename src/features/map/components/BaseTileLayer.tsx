import { TileLayer } from 'react-leaflet';

import { showToast } from '@/shared/ui/toast';

const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

let tileErrorReported = false;

/** Offline, dozens of tiles fail at once — report only once per session. */
function reportTileError(): void {
  if (tileErrorReported) return;
  tileErrorReported = true;
  showToast({
    id: 'tile-error',
    tone: 'error',
    message: 'Не вдалося завантажити підкладку карти. Поля й точки працюють і без неї.',
  });
}

export function BaseTileLayer() {
  return (
    <TileLayer
      url={TILE_URL}
      attribution={ATTRIBUTION}
      eventHandlers={{ tileerror: reportTileError }}
    />
  );
}
