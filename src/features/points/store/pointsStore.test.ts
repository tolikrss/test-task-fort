import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { makePoint } from '@/test/fixtures';
import { createMemoryStorage } from '@/test/memoryStorage';

const KEY = 'fort.points';

const VALID_POINT = makePoint({ description: 'Sample' });

function stored(points: unknown[]): Record<string, string> {
  return { [KEY]: JSON.stringify({ state: { points }, version: 1 }) };
}

/** persist hydrates state when the store is created, so each test gets a fresh module. */
async function loadStores(storage: Storage | undefined) {
  vi.stubGlobal('localStorage', storage);
  vi.resetModules();
  const { usePointsStore } = await import('./pointsStore');
  const { useToastStore } = await import('@/shared/ui/toast');

  return { usePointsStore, useToastStore };
}

describe('usePointsStore', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('addPoint assigns id and createdAt and saves to localStorage', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-23T12:00:00.000Z'));
    const storage = createMemoryStorage();
    const { usePointsStore } = await loadStores(storage);

    const point = usePointsStore.getState().addPoint({
      fieldId: 'field-1',
      lat: 50.455,
      lng: 30.528,
      type: 'pests',
      description: 'Aphids',
    });

    expect(point.id).not.toBe('');
    expect(point.createdAt).toBe('2026-09-23T12:00:00.000Z');
    expect(usePointsStore.getState().points).toEqual([point]);
    expect(JSON.parse(storage.getItem(KEY) ?? '')).toMatchObject({
      version: 1,
      state: { points: [point] },
    });
  });

  it('removePoint deletes the point', async () => {
    const { usePointsStore } = await loadStores(createMemoryStorage(stored([VALID_POINT])));

    usePointsStore.getState().removePoint('p-1');
    expect(usePointsStore.getState().points).toEqual([]);
  });

  it('restores valid points without notifications', async () => {
    const { usePointsStore, useToastStore } = await loadStores(
      createMemoryStorage(stored([VALID_POINT])),
    );

    expect(usePointsStore.getState().points).toEqual([VALID_POINT]);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('skips corrupted points, keeps valid ones and shows one toast', async () => {
    const { usePointsStore, useToastStore } = await loadStores(
      createMemoryStorage(stored([VALID_POINT, { ...VALID_POINT, id: 'p-2', lat: 'north' }])),
    );

    expect(usePointsStore.getState().points).toEqual([VALID_POINT]);
    expect(useToastStore.getState().toasts).toHaveLength(1);
  });

  it('non-JSON record — empty state and a toast', async () => {
    const { usePointsStore, useToastStore } = await loadStores(
      createMemoryStorage({ [KEY]: '{not json' }),
    );

    expect(usePointsStore.getState().points).toEqual([]);
    expect(useToastStore.getState().toasts).toHaveLength(1);
  });

  it('first launch — empty state without a toast', async () => {
    const { usePointsStore, useToastStore } = await loadStores(createMemoryStorage());

    expect(usePointsStore.getState().points).toEqual([]);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('unavailable localStorage does not break the store', async () => {
    const { usePointsStore } = await loadStores(undefined);

    usePointsStore
      .getState()
      .addPoint({ fieldId: 'field-1', lat: 50.455, lng: 30.528, type: 'other' });
    expect(usePointsStore.getState().points).toHaveLength(1);
  });

  it('a write error (storage full) is logged and state still updates', async () => {
    const storage = createMemoryStorage();

    storage.setItem = () => {
      throw new DOMException('Storage is full', 'QuotaExceededError');
    };

    const { usePointsStore } = await loadStores(storage);

    usePointsStore
      .getState()
      .addPoint({ fieldId: 'field-1', lat: 50.455, lng: 30.528, type: 'other' });

    expect(usePointsStore.getState().points).toHaveLength(1);
    expect(console.error).toHaveBeenCalled();
  });

  it('a write error shows the user one toast that points are not saved', async () => {
    const storage = createMemoryStorage();

    storage.setItem = () => {
      throw new DOMException('Storage is full', 'QuotaExceededError');
    };

    const { usePointsStore, useToastStore } = await loadStores(storage);

    const { addPoint } = usePointsStore.getState();

    addPoint({ fieldId: 'field-1', lat: 50.455, lng: 30.528, type: 'other' });
    addPoint({ fieldId: 'field-1', lat: 50.456, lng: 30.529, type: 'soil' });

    expect(useToastStore.getState().toasts).toHaveLength(1);
  });

  it('addPoint works without crypto.randomUUID (plain http on a LAN is not a secure context)', async () => {
    vi.stubGlobal('crypto', {});
    const { usePointsStore } = await loadStores(createMemoryStorage());

    const { addPoint } = usePointsStore.getState();
    const first = addPoint({ fieldId: 'field-1', lat: 50.455, lng: 30.528, type: 'other' });
    const second = addPoint({ fieldId: 'field-1', lat: 50.456, lng: 30.529, type: 'soil' });

    expect(first.id).not.toBe(second.id);
    expect(usePointsStore.getState().points).toHaveLength(2);
  });
});
