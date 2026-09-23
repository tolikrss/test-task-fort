import { getFields } from '../services/fieldsData';

import type { Field } from '../model';
import type { NonEmptyArray } from '@/shared/lib/types';

/** Fields are static data, not state; a hook so that a parse error surfaces during render. */
export function useFields(): NonEmptyArray<Field> {
  return getFields();
}
