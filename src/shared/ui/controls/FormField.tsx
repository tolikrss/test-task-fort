import { useId, type ReactNode } from 'react';

import { labelClassName } from './controlStyles';

export interface FormFieldControlProps {
  id: string;
  'aria-invalid': true | undefined;
  'aria-describedby': string | undefined;
}

interface FormFieldProps {
  label: ReactNode;
  /** Keep the label for screen readers only (e.g. when a placeholder explains the field). */
  hideLabel?: boolean;
  error?: string;
  /** Helper text under the control, e.g. a character counter. */
  hint?: ReactNode;
  /** Renders the native control; spread the given props onto it. */
  children: (control: FormFieldControlProps) => ReactNode;
}

/** Label, native control and error/hint wired together with ids and ARIA attributes. */
export function FormField({ label, hideLabel = false, error, hint, children }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const hasHint = hint !== undefined;
  const describedBy = [error ? errorId : null, hasHint ? hintId : null]
    .filter((value) => value !== null)
    .join(' ');

  return (
    <div>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : labelClassName}>
        {label}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy || undefined,
      })}
      {(error || hasHint) && (
        <div className="mt-1 flex justify-between gap-2 text-xs">
          <span id={errorId} className="text-red-600">
            {error}
          </span>
          {hasHint && (
            <span id={hintId} className="text-slate-500 tabular-nums">
              {hint}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
