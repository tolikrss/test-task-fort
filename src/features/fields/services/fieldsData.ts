import rawFields from '../data/fields.geojson?raw';
import { FieldsDataError, parseFields, type Field } from '../model';

import type { NonEmptyArray } from '@/shared/lib/types';

let cachedFields: NonEmptyArray<Field> | undefined;

/**
 * Parsed lazily — on first render, not at module import time.
 * That way ErrorBoundary catches a data error and shows a clear screen instead of a blank page.
 */
export function getFields(): NonEmptyArray<Field> {
  cachedFields ??= parseFields(parseJson(rawFields));

  return cachedFields;
}

function parseJson(text: string): unknown {
  try {
    const parsed: unknown = JSON.parse(text);

    return parsed;
  } catch {
    throw new FieldsDataError('Файл полів не є коректним JSON');
  }
}
