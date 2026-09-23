import { create } from 'zustand';

interface FieldsState {
  /** null — nothing selected yet; the first field is treated as active then (see useActiveField). */
  activeFieldId: string | null;
  selectField: (id: string) => void;
}

export const useFieldsStore = create<FieldsState>()((set) => ({
  activeFieldId: null,
  selectField: (id) => set({ activeFieldId: id }),
}));
