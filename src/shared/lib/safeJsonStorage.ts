import { z } from 'zod';

import type { PersistStorage } from 'zustand/middleware';

interface SafeJsonStorageOptions {
  getStorage: () => Storage;
  /** A record exists but is not JSON or not a persist envelope ({ state, version }). */
  onReadError: () => void;
  /** A write failed (storage unavailable or full) — data lives only until the page reloads. */
  onWriteError: () => void;
}

const storageEnvelopeSchema = z.object({
  state: z.unknown(),
  version: z.number().optional(),
});

/**
 * Zustand PersistStorage that never breaks the app:
 * - storage unavailable (private mode, blocked cookies) → start with empty state;
 * - corrupted record → onReadError and start with empty state;
 * - failed write (storage full) → log and onWriteError; in-memory state keeps working.
 */
export function createSafeJsonStorage<S>({
  getStorage,
  onReadError,
  onWriteError,
}: SafeJsonStorageOptions): PersistStorage<S> {
  return {
    getItem: (name) => {
      let raw: string | null;

      try {
        raw = getStorage().getItem(name);
      } catch (error) {
        console.warn('[storage] Storage unavailable, data not restored', error);

        return null;
      }

      if (raw === null) return null;

      let parsed: unknown;

      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = undefined;
      }

      const envelope = storageEnvelopeSchema.safeParse(parsed);

      if (!envelope.success) {
        console.warn(`[storage] Skipped corrupted record "${name}"`);
        onReadError();

        return null;
      }

      // The only deliberate `as` in the project: the state itself is not validated yet — the store's
      // `merge` does that because it knows the schema. Only the persist envelope is checked here.
      return { state: envelope.data.state as S, version: envelope.data.version };
    },
    setItem: (name, value) => {
      try {
        getStorage().setItem(name, JSON.stringify(value));
      } catch (error) {
        console.error('[storage] Failed to save data', error);
        onWriteError();
      }
    },
    removeItem: (name) => {
      try {
        getStorage().removeItem(name);
      } catch (error) {
        console.error('[storage] Failed to remove data', error);
      }
    },
  };
}
