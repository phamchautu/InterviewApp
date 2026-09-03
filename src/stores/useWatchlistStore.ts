import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../types';

interface WatchlistState {
  watchlist: Movie[];
}

interface WatchlistActions {
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

export const useWatchlistStore = create<WatchlistState & WatchlistActions>()(

  persist(

    (set, get) => ({

      watchlist: [],

      addToWatchlist: (movie) => {


        const { watchlist } = get();
        if (!watchlist.find((m) => m.id === movie.id)) {
          set({ watchlist: [...watchlist, movie] });
        }
      },

      removeFromWatchlist: (movieId) => {
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== movieId),
        }));
      },

      isInWatchlist: (movieId) => {
        return !!get().watchlist.find((m) => m.id === movieId);
      },
    }),
    {
      name: 'watchlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
