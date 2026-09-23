import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { showToast, TOAST_DURATION_MS, useToastStore } from './toastStore';

describe('toastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('shows a toast without crypto.randomUUID (plain http on a LAN is not a secure context)', () => {
    vi.stubGlobal('crypto', {});
    showToast({ message: 'Point deleted' });
    showToast({ message: 'Point deleted' });
    expect(useToastStore.getState().toasts).toHaveLength(2);
  });

  it('does not show a second toast with the same id while the first is visible', () => {
    showToast({ id: 'tile-error', message: 'Error' });
    showToast({ id: 'tile-error', message: 'Error' });
    expect(useToastStore.getState().toasts).toHaveLength(1);
  });

  it('removes a toast after TOAST_DURATION_MS', () => {
    showToast({ message: 'Point added', tone: 'success' });
    vi.advanceTimersByTime(TOAST_DURATION_MS);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
