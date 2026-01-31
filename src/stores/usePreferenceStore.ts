import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MovieCategory = 'now_playing' | 'upcoming' | 'popular';
export type SortOption = 'alphabetical' | 'rating' | 'release_date';

interface PreferenceState {
  selectedCategory: MovieCategory;
  sortBy: SortOption | null;
}

interface PreferenceActions {
  setSelectedCategory: (category: MovieCategory) => void;
  setSortBy: (sortBy: SortOption | null) => void;
}

export const usePreferenceStore = create<PreferenceState & PreferenceActions>()(
  persist(
    (set) => ({
      selectedCategory: 'now_playing', // Default category
      sortBy: null, // Default to no sorting

      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSortBy: (sortBy) => set({ sortBy: sortBy }),
    }),
    {
      name: 'preference-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
