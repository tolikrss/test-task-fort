import { z } from 'zod';

import { monitoringPointSchema, type MonitoringPoint } from '../model';

export interface PersistedPoints {
  points: MonitoringPoint[];
}

export interface SanitizeResult {
  points: MonitoringPoint[];
  /** true if anything had to be dropped — a reason to notify the user. */
  hadInvalidData: boolean;
}

const persistedShapeSchema = z.object({ points: z.array(z.unknown()) });

/**
 * localStorage is an external source: it may have been edited by hand or written by an older version.
 * Each point is validated separately so one corrupted record does not wipe the rest.
 */
export function sanitizePersistedPoints(persisted: unknown): SanitizeResult {
  if (persisted === undefined || persisted === null) {
    return { points: [], hadInvalidData: false };
  }

  const shape = persistedShapeSchema.safeParse(persisted);

  if (!shape.success) {
    return { points: [], hadInvalidData: true };
  }

  const points = shape.data.points.flatMap((candidate) => {
    const result = monitoringPointSchema.safeParse(candidate);

    return result.success ? [result.data] : [];
  });

  return { points, hadInvalidData: points.length !== shape.data.points.length };
}
