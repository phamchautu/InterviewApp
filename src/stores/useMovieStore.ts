import { create } from 'zustand';
import { Movie, TMDBMovie, TMDBResponse } from '@/types';
import { useErrorStore } from '@/stores/useErrorStore';
import { api } from '@/services/api';

interface MovieState {
  movies: Movie[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  page: number;
  totalPages: number;
}

interface MovieActions {
  setMovies: (movies: Movie[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchMovies: (params: { 
    category: string; 
    sortBy: string | null; 
    searchQuery: string;
    page?: number; 
  }) => Promise<void>;
  fetchNextPage: (params: { 
    category: string; 
    sortBy: string | null; 
    searchQuery: string;
  }) => Promise<void>;
  clearMovies: () => void;
}

export const useMovieStore = create<MovieState & MovieActions>((set, get) => ({
  movies: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  page: 1,
  totalPages: 1,

  setMovies: (movies) => set({ movies }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchMovies: async ({ category, sortBy, searchQuery, page = 1 }) => {
    if (page === 1) {
      set({ isLoading: true, error: null, page: 1 });
    } else {
      set({ isLoading: true, error: null }); // Ensure loading state for pagination
    }

    try {
      let endpoint = '/3/discover/movie';
      const params: any = {
        include_adult: false,
        include_video: false,
        language: 'en-US',
        page: page,
      };

      if (searchQuery && searchQuery.trim()) {
        endpoint = '/3/search/movie';
        params['query'] = searchQuery;
      } else {
        const sortMapping: Record<string, string> = {
          alphabetical: 'original_title.asc',
          rating: 'vote_average.desc',
          release_date: 'primary_release_date.desc',
        };
        
        params['sort_by'] = sortBy ? sortMapping[sortBy] : 'popularity.desc';

        const today = new Date();
        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        if (category === 'now_playing') {
          const minDate = new Date();
          minDate.setDate(today.getDate() - 45);
          
          params['with_release_type'] = '2|3';
          params['release_date.gte'] = formatDate(minDate);
          params['release_date.lte'] = formatDate(today);
        } else if (category === 'upcoming') {
          const minDate = new Date();
          minDate.setDate(today.getDate() + 1);
          const maxDate = new Date();
          maxDate.setDate(today.getDate() + 30);

          params['with_release_type'] = '2|3';
          params['release_date.gte'] = formatDate(minDate);
          params['release_date.lte'] = formatDate(maxDate);
        }
      }

      const response = await api.get<TMDBResponse<TMDBMovie>>(endpoint, params);
      
      set((state) => ({ 
        movies: page === 1 ? response.data.results : [...state.movies, ...response.data.results],
        totalPages: response.data.total_pages,
        page: page,
      }));

    } catch (error: any) {
      console.error('Fetch movies failed:', error);
      const errorMessage = error?.response?.data?.status_message || error?.message || 'Failed to fetch movies.';
      set({ error: errorMessage });
      useErrorStore.getState().showError(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNextPage: async (params) => {
    const { page, totalPages, isLoading } = get();
    if (page < totalPages && !isLoading) {
      await get().fetchMovies({ ...params, page: page + 1 });
    }
  },

  clearMovies: () => set({ movies: [], page: 1, totalPages: 1 }),
}));
