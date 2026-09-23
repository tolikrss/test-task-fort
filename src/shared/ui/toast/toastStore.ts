import { create } from 'zustand';

import { createId } from '@/shared/lib/createId';

export type ToastTone = 'info' | 'success' | 'error';

export interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

export interface ShowToastOptions {
  message: string;
  tone?: ToastTone;
  /** A toast with the same id is not duplicated while the previous one is visible (e.g. a burst of tile errors). */
  id?: string;
}

export const TOAST_DURATION_MS = 4000;

interface ToastState {
  toasts: Toast[];
  show: (options: ShowToastOptions) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: ({ message, tone = 'info', id = createId() }) => {
    if (get().toasts.some((toast) => toast.id === id)) return;
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }));
    setTimeout(() => get().dismiss(id), TOAST_DURATION_MS);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

/** Works outside React too (stores, Leaflet handlers), hence a function rather than a hook. */
export function showToast(options: ShowToastOptions): void {
  useToastStore.getState().show(options);
}
