import { create } from 'zustand';

import { findFieldAt, resolveActiveFieldId, useFieldsStore } from '@/features/fields';

import { DEFAULT_POINT_FILTERS, type PointFilters } from '../model';

import type { LatLng } from '@/shared/lib/geo';

export type PointsMode = 'idle' | 'adding';

/** Pause after the last keystroke before the search query is applied to the list and the map. */
export const SEARCH_DEBOUNCE_MS = 200;

export interface PointFocus {
  pointId: string;
  /** Where the focus came from: from the list — fly on the map; from the map — scroll the list. */
  source: 'list' | 'map';
}

interface PointsUiState {
  mode: PointsMode;
  /** Coordinates of a new point before saving (temporary marker + form). */
  draft: LatLng | null;
  filters: PointFilters;
  /** Text in the search input; `filters.query` receives it after SEARCH_DEBOUNCE_MS. */
  searchText: string;
  focus: PointFocus | null;
  /** Point whose delete confirmation dialog is open. */
  pendingDeleteId: string | null;
  startAdding: () => void;
  setDraft: (latLng: LatLng) => void;
  stopAdding: () => void;
  setFilters: (patch: Partial<PointFilters>) => void;
  setSearchText: (text: string) => void;
  resetFilters: () => void;
  focusPoint: (pointId: string, source: PointFocus['source']) => void;
  requestDelete: (pointId: string) => void;
  cancelDelete: () => void;
}

// One debounce for the whole app: the list and the map both read the applied `filters.query`.
let searchTimer: ReturnType<typeof setTimeout> | undefined;

export const usePointsUiStore = create<PointsUiState>()((set) => ({
  mode: 'idle',
  draft: null,
  filters: DEFAULT_POINT_FILTERS,
  searchText: DEFAULT_POINT_FILTERS.query,
  focus: null,
  pendingDeleteId: null,
  startAdding: () => set({ mode: 'adding', draft: null }),
  setDraft: (draft) => set((state) => (state.mode === 'adding' ? { draft } : state)),
  stopAdding: () => set({ mode: 'idle', draft: null }),
  setFilters: (patch) => set((state) => ({ filters: { ...state.filters, ...patch } })),
  setSearchText: (text) => {
    set({ searchText: text });
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      set((state) => ({ filters: { ...state.filters, query: text } }));
    }, SEARCH_DEBOUNCE_MS);
  },
  resetFilters: () => {
    clearTimeout(searchTimer);
    set({ filters: DEFAULT_POINT_FILTERS, searchText: DEFAULT_POINT_FILTERS.query });
  },
  // A new object every time: clicking the same point again re-triggers the flight/scroll.
  focusPoint: (pointId, source) => set({ focus: { pointId, source } }),
  requestDelete: (pointId) => set({ pendingDeleteId: pointId }),
  cancelDelete: () => set({ pendingDeleteId: null }),
}));

// Changing the field cancels an unfinished add unless the draft already lies inside the new field
// (a click on another field in add mode sets the draft first and then switches the field).
// Subscribed here, not in fields: fields must not know about points (dependency is points → fields only).
// Compares the effectively active field: selecting the default (first) field from `null` is not a change.
useFieldsStore.subscribe((state, previous) => {
  const nextFieldId = resolveActiveFieldId(state.activeFieldId);

  if (nextFieldId === resolveActiveFieldId(previous.activeFieldId)) return;

  const { draft, stopAdding } = usePointsUiStore.getState();

  if (draft && findFieldAt(draft)?.id === nextFieldId) return;

  stopAdding();
});
