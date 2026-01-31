import { create } from 'zustand';

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
 */
export const useAppStore = create<AppState & AppActions>((set) => ({
  isInitialized: false,
  theme: 'light',

  setInitialized: (value) => set({ isInitialized: value }),
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}));