import { useEffect } from 'react';

import { usePointsUiStore } from '@/features/points';

/**
 * A single Esc handler with explicit priority: cancel adding a point first, then close the panel.
 * ConfirmDialog stops Esc propagation, so an open dialog never reaches this handler.
 */
export function useGlobalEscape(onEscape: () => void): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      const { mode, stopAdding } = usePointsUiStore.getState();

      if (mode === 'adding') {
        stopAdding();

        return;
      }

      onEscape();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape]);
}
