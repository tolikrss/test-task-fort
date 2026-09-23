import { getFields } from './fieldsData';

import type { Field } from '../model';
import type { NonEmptyArray } from '@/shared/lib/types';

/** The selected field, or the first one while nothing has been selected yet. */
export function resolveActiveField(
  fields: NonEmptyArray<Field>,
  activeFieldId: string | null,
): Field {
  return fields.find((field) => field.id === activeFieldId) ?? fields[0];
}

/** Same rule outside React (store subscriptions): the id of the field that is effectively active. */
export function resolveActiveFieldId(activeFieldId: string | null): string {
  return resolveActiveField(getFields(), activeFieldId).id;
}
