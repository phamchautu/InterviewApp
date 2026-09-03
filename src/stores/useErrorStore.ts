import { create } from 'zustand';

interface ErrorState {
  isVisible: boolean;
  message: string;
  title?: string;
}

interface ErrorActions {
  showError: (message: string, title?: string) => void;
  hideError: () => void;
}

export const useErrorStore = create<ErrorState & ErrorActions>((set) => ({
  isVisible: false,
  message: '',
  title: 'Error',

  showError: (message, title = 'Error') => set({ isVisible: true, message, title }),
  hideError: () => set({ isVisible: false, message: '', title: 'Error' }),
}));
