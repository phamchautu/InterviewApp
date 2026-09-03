import { Movie } from '@/types';

export type SortType = 'alphabetical' | 'rating' | 'release_date';
export type SortOrder = 'asc' | 'desc';

/**
 * Sorts an array of movies based on the specified criteria and order.
 */
export const sortMovies = (movies: Movie[], type: SortType, order: SortOrder = 'desc'): Movie[] => {
  const sorted = [...movies];

  const multiplier = order === 'asc' ? 1 : -1;

  switch (type) {
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title) * multiplier);
    case 'rating':
      return sorted.sort((a, b) => (a.vote_average - b.vote_average) * multiplier);
    case 'release_date':
      return sorted.sort((a, b) => {
        const timeA = new Date(a.release_date).getTime();
        const timeB = new Date(b.release_date).getTime();
        return (timeA - timeB) * multiplier;
      });
    default:
      return sorted;
  }
};
