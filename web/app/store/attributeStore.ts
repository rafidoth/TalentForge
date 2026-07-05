import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchAttributeTypesAndCategories } from '~/api/attributes';
import type { AttributeCategoryDto, AttributeType } from '~/api/types';

interface AttributeState {
  categories: AttributeCategoryDto[];
  types: AttributeType[];
  isLoading: boolean;
  fetchLookups: () => Promise<void>;
}

export const useAttributeStore = create<AttributeState>()(
  persist(
    (set, get) => ({
      categories: [],
      types: [],
      isLoading: false,
      fetchLookups: async () => {
        // If already fetched, don't fetch again!
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
    }),
    {
      name: 'attribute-lookup-storage', // key in localStorage
    }
  )
);
