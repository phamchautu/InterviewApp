import { create } from 'zustand';
import { useErrorStore } from './useErrorStore';
import { api } from '../services/api';

import { MovieDetail, TMDBMovie, TMDBResponse } from '../types';

interface MovieDetailState {
  movie: MovieDetail | null;
  recommendations: TMDBMovie[];
  isLoading: boolean;
  error: string | null;
}

interface MovieDetailActions {
  fetchMovieDetail: (id: number) => Promise<void>;
  clearMovieDetail: () => void;
}

export const useMovieDetailStore = create<MovieDetailState & MovieDetailActions>((set) => ({
  movie: null,
  recommendations: [],
  isLoading: false,
  error: null,

  fetchMovieDetail: async (id: number) => {
    set({ isLoading: true, error: null, movie: null, recommendations: [] });
    try {
      const [detailRes, recRes] = await Promise.all([
        api.get<MovieDetail>(`/3/movie/${id}`, {
          append_to_response: 'credits,release_dates',
        }),
        api.get<TMDBResponse<TMDBMovie>>(`/3/movie/${id}/recommendations`).catch(() => ({ data: { results: [] } })),
      ]);

      if (__DEV__) {
        console.log(`[Recommendations] Loaded ${recRes.data?.results?.length || 0} items for ID ${id}`);
      }

      set({ 
        movie: detailRes.data,
        recommendations: recRes.data?.results || [],
      });
    } catch (error: any) {
      console.error('Fetch movie detail failed:', error);
      const errorMessage = error?.response?.data?.status_message || error?.message || 'Failed to load movie details.';
      set({ error: errorMessage });
      useErrorStore.getState().showError(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  clearMovieDetail: () => set({ movie: null, recommendations: [] }),
}));
