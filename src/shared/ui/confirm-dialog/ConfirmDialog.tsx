import { useEffect, useId, useRef } from 'react';

import { Button } from '../controls';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Native <dialog> + showModal(): the browser provides the focus trap, inert background, top layer
 * and focus return. Open state lives in React (`open` prop), so the native Esc close is cancelled.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      // Esc inside the dialog must not reach the global handler (cancel adding / close the panel).
      onKeyDown={(event) => {
        if (event.key === 'Escape') event.stopPropagation();
      }}
      // Backdrop click: the target is the <dialog> itself because the content fills its whole area.
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      className="m-auto w-[min(24rem,calc(100vw-2rem))] rounded-lg p-0 shadow-xl backdrop:bg-slate-900/40"
    >
      {open && (
        <div className="space-y-4 p-5">
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="text-sm text-slate-600">
              {description}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" autoFocus onClick={onCancel}>
              Скасувати
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );
}
