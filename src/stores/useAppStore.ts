import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  isInitialized: boolean;
  theme: 'light' | 'dark';
}

interface AppActions {
  setInitialized: (value: boolean) => void;
  toggleTheme: () => void;
}

/**
 * App-wide configuration store.
 * Following Senior Standards: Actions are co-located with state.
 * Persisted using AsyncStorage.
 */
export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      isInitialized: false,
      theme: 'light',

      setInitialized: (value) => set({ isInitialized: value }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
    }),
    {
      name: 'app-storage', // unique name for storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
