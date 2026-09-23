import { cn } from '@/shared/lib/cn';
import { formatAreaHa } from '@/shared/lib/format';

import { useActiveField } from '../hooks/useActiveField';
import { useFields } from '../hooks/useFields';
import { useFieldsStore } from '../store/fieldsStore';

interface FieldListProps {
  /** Called after a field is selected — e.g. to close the drawer on tablet. */
  onSelect?: () => void;
}

export function FieldList({ onSelect }: FieldListProps) {
  const fields = useFields();
  const activeField = useActiveField();
  const selectField = useFieldsStore((state) => state.selectField);

  return (
    <ul className="space-y-1">
      {fields.map((field) => {
        const isActive = field.id === activeField.id;

        return (
          <li key={field.id}>
            <button
              type="button"
              aria-current={isActive ? 'true' : undefined}
              onClick={() => {
                selectField(field.id);
                onSelect?.();
              }}
              className={cn(
                'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-brand-600',
                isActive
                  ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-500'
                  : 'hover:bg-slate-100',
              )}
            >
              <span className="min-w-0">
                <span className="block truncate font-medium">{field.name}</span>
                <span className="block text-xs text-slate-500">{field.crop}</span>
              </span>
              <span className="shrink-0 text-sm text-slate-600 tabular-nums">
                {formatAreaHa(field.areaHa)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
