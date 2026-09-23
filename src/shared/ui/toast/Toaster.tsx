import { cn } from '@/shared/lib/cn';

import { IconButton } from '../controls';

import { useToastStore, type ToastTone } from './toastStore';

const TONE_CLASSES: Record<ToastTone, string> = {
  info: 'border-slate-200 bg-white text-slate-800',
  success: 'border-brand-500 bg-brand-50 text-brand-800',
  error: 'border-red-300 bg-red-50 text-red-800',
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-4 z-[1300] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-lg',
            TONE_CLASSES[toast.tone],
          )}
        >
          <p className="flex-1">{toast.message}</p>
          <IconButton
            label="Закрити повідомлення"
            icon="✕"
            onClick={() => dismiss(toast.id)}
            className="-my-1 size-7 shrink-0 text-current opacity-60 hover:bg-transparent hover:opacity-100"
          />
        </div>
      ))}
    </div>
  );
}
