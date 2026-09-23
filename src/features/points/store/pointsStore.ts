import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createId } from '@/shared/lib/createId';
import { createSafeJsonStorage } from '@/shared/lib/safeJsonStorage';
import { showToast } from '@/shared/ui/toast';

import { sanitizePersistedPoints, type PersistedPoints } from './persistence';

import type { MonitoringPoint, NewPointInput } from '../model';

export const POINTS_STORAGE_KEY = 'fort.points';

/** Bumped on an incompatible point schema change (a `migrate` will be added then). */
const POINTS_STORAGE_VERSION = 1;

interface PointsState {
  points: MonitoringPoint[];
  addPoint: (input: NewPointInput) => MonitoringPoint;
  removePoint: (id: string) => void;
}

function notifyRestoreFailed(): void {
  showToast({
    id: 'points-restore-failed',
    tone: 'error',
    message: 'Частину збережених точок не вдалося відновити — пошкоджені записи пропущено',
  });
}

function notifySaveFailed(): void {
  // Fixed id: every subsequent failed write does not add another toast.
  showToast({
    id: 'points-save-failed',
    tone: 'error',
    message: 'Не вдалося зберегти точки в браузері — після перезавантаження сторінки вони зникнуть',
  });
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set) => ({
      points: [],
      addPoint: (input) => {
        const point: MonitoringPoint = {
          ...input,
          id: createId(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ points: [...state.points, point] }));

        return point;
      },
      removePoint: (id) =>
        set((state) => ({ points: state.points.filter((point) => point.id !== id) })),
    }),
    {
      name: POINTS_STORAGE_KEY,
      version: POINTS_STORAGE_VERSION,
      storage: createSafeJsonStorage<PersistedPoints>({
        getStorage: () => localStorage,
        onReadError: notifyRestoreFailed,
        onWriteError: notifySaveFailed,
      }),
      // Persist only data, not functions.
      partialize: (state): PersistedPoints => ({ points: state.points }),
      // merge runs on every hydration, including with undefined on the very first launch.
      merge: (persisted, current) => {
        const { points, hadInvalidData } = sanitizePersistedPoints(persisted);

        if (hadInvalidData) {
          console.warn('[points] Skipped invalid persisted data', persisted);
          notifyRestoreFailed();
        }

        return { ...current, points };
      },
    },
  ),
);
