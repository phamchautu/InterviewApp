import { create } from 'zustand';
import { UserProfile } from '../types';
import { useErrorStore } from './useErrorStore';
import { api } from '../services/api';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<UserProfile>('/3/account');
      set({ profile: response.data });
    } catch (error: any) {
      console.error('Fetch profile failed:', error);
      const errorMessage = error?.response?.data?.status_message || error?.message || 'Failed to load profile.';
      set({ error: errorMessage });
      // Not showing global error here to avoid intrusive popups on background load
    } finally {
      set({ isLoading: false });
    }
  },

  clearProfile: () => set({ profile: null }),
}));
