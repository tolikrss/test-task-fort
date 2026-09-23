import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFieldsStore } from '@/features/fields';

import { DEFAULT_POINT_FILTERS } from '../model';

import { SEARCH_DEBOUNCE_MS, usePointsUiStore } from './pointsUiStore';

describe('usePointsUiStore', () => {
  beforeEach(() => {
    usePointsUiStore.setState(usePointsUiStore.getInitialState(), true);
    useFieldsStore.setState({ activeFieldId: null });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('startAdding enables add mode without a draft', () => {
    usePointsUiStore.getState().startAdding();
    expect(usePointsUiStore.getState()).toMatchObject({ mode: 'adding', draft: null });
  });

  it('setDraft is ignored outside add mode', () => {
    usePointsUiStore.getState().setDraft({ lat: 50.45, lng: 30.52 });
    expect(usePointsUiStore.getState().draft).toBeNull();
  });

  it('setDraft in add mode places and moves the draft', () => {
    const { startAdding, setDraft } = usePointsUiStore.getState();

    startAdding();
    setDraft({ lat: 50.45, lng: 30.52 });
    setDraft({ lat: 50.46, lng: 30.53 });
    expect(usePointsUiStore.getState().draft).toEqual({ lat: 50.46, lng: 30.53 });
  });

  it('stopAdding leaves add mode and clears the draft', () => {
    const { startAdding, setDraft, stopAdding } = usePointsUiStore.getState();

    startAdding();
    setDraft({ lat: 50.45, lng: 30.52 });
    stopAdding();
    expect(usePointsUiStore.getState()).toMatchObject({ mode: 'idle', draft: null });
  });

  it('changing the active field cancels an unfinished add', () => {
    const { startAdding, setDraft } = usePointsUiStore.getState();

    startAdding();
    setDraft({ lat: 50.45, lng: 30.52 });
    useFieldsStore.getState().selectField('field-2');
    expect(usePointsUiStore.getState()).toMatchObject({ mode: 'idle', draft: null });
  });

  it('switching to the field that contains the draft keeps adding', () => {
    const { startAdding, setDraft } = usePointsUiStore.getState();
    const insideField2 = { lat: 50.425, lng: 30.865 };

    startAdding();
    setDraft(insideField2);
    useFieldsStore.getState().selectField('field-2');
    expect(usePointsUiStore.getState()).toMatchObject({ mode: 'adding', draft: insideField2 });
  });

  it('selecting the field that is already active by default keeps the draft', () => {
    const { startAdding, setDraft } = usePointsUiStore.getState();

    startAdding();
    setDraft({ lat: 50.45, lng: 30.52 });
    // activeFieldId is null, so the first field is already the active one
    useFieldsStore.getState().selectField('field-1');
    expect(usePointsUiStore.getState()).toMatchObject({
      mode: 'adding',
      draft: { lat: 50.45, lng: 30.52 },
    });
  });

  it('setFilters merges changes, resetFilters restores defaults', () => {
    const { setFilters, resetFilters } = usePointsUiStore.getState();

    setFilters({ type: 'pests' });
    setFilters({ query: 'beetle' });
    expect(usePointsUiStore.getState().filters).toEqual({
      ...DEFAULT_POINT_FILTERS,
      type: 'pests',
      query: 'beetle',
    });
    resetFilters();
    expect(usePointsUiStore.getState().filters).toEqual(DEFAULT_POINT_FILTERS);
  });

  it('setSearchText updates the input at once and applies the query after the debounce', () => {
    vi.useFakeTimers();
    usePointsUiStore.getState().setSearchText('beetle');
    expect(usePointsUiStore.getState().searchText).toBe('beetle');
    expect(usePointsUiStore.getState().filters.query).toBe('');

    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    expect(usePointsUiStore.getState().filters.query).toBe('beetle');
  });

  it('only the last text typed within the debounce is applied', () => {
    vi.useFakeTimers();
    const { setSearchText } = usePointsUiStore.getState();

    setSearchText('bee');
    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1);
    setSearchText('beetle');
    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    expect(usePointsUiStore.getState().filters.query).toBe('beetle');
  });

  it('resetFilters clears the search text and cancels a pending query', () => {
    vi.useFakeTimers();
    const { setSearchText, resetFilters } = usePointsUiStore.getState();

    setSearchText('beetle');
    resetFilters();
    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    expect(usePointsUiStore.getState()).toMatchObject({
      searchText: '',
      filters: DEFAULT_POINT_FILTERS,
    });
  });
});
