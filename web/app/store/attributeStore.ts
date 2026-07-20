import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchAttributeTypesAndCategories } from '~/api/attributes';
import type { AttributeCategoryDto, AttributeType } from '~/api/types';

interface AttributeState {
  categories: AttributeCategoryDto[];
  types: AttributeType[];
  isLoading: boolean;
  
  // UI State
  search: string;
  page: number;
  activeTab: string | null;
  selectedIds: Set<string>;

  // Actions
  fetchLookups: () => Promise<void>;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setActiveTab: (tab: string | null) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
}

export const useAttributeStore = create<AttributeState>()(
  persist(
    (set, get) => ({
      categories: [],
      types: [],
      isLoading: false,
      search: "",
      page: 1,
      activeTab: "all",
      selectedIds: new Set(),
      fetchLookups: async () => {
        if (get().categories.length > 0 && get().types.length > 0) {
          return;
        }

        set({ isLoading: true });
        try {
          const data = await fetchAttributeTypesAndCategories();
          set({
            categories: data.categories,
            types: data.types,
            isLoading: false
          });
        } catch (error) {
          console.error("Failed to fetch attribute lookups", error);
          set({ isLoading: false });
        }
      },
      setSearch: (search) => set({ search, page: 1 }),
      setPage: (page) => set({ page }),
      setActiveTab: (activeTab) => set({ activeTab, page: 1 }),
      toggleSelection: (id) => set((state) => {
        const newSet = new Set(state.selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        return { selectedIds: newSet };
      }),
      clearSelection: () => set({ selectedIds: new Set() })
    }),
    {
      name: 'attribute-lookup-storage',
      partialize: (state) => ({ categories: state.categories, types: state.types }),
    }
  )
);
