import { resolveActiveField } from '../services/activeField';
import { useFieldsStore } from '../store/fieldsStore';

import { useFields } from './useFields';

import type { Field } from '../model';

export function useActiveField(): Field {
  const fields = useFields();
  const activeFieldId = useFieldsStore((state) => state.activeFieldId);

  return resolveActiveField(fields, activeFieldId);
}
