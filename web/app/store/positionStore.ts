import { create } from 'zustand';

interface PositionState {
  search: string;
  page: number;
  selectedIds: Set<string>;
  isCreateModalOpen: boolean;

  // Actions
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  toggleSelection: (id: string) => void;
  setSelectedIds: (ids: Set<string>) => void;
  clearSelection: () => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  resetStore: () => void;
}

const initialState = {
  search: "",
  page: 1,
  selectedIds: new Set<string>(),
  isCreateModalOpen: false,
};

export const usePositionStore = create<PositionState>((set) => ({
  ...initialState,

  setSearch: (search: string) => set({ search, page: 1 }),
  setPage: (page: number) => set({ page }),
  toggleSelection: (id: string) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    }),
  setSelectedIds: (selectedIds: Set<string>) => set({ selectedIds }),
  clearSelection: () => set({ selectedIds: new Set<string>() }),
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  resetStore: () => set({ ...initialState, selectedIds: new Set<string>() }),
}));
