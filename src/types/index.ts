export interface UserProfile {
  id: number;
  name: string;
  username: string;
  avatar: {
    tmdb: {
      avatar_path: string | null;
    };
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface ReleaseDate {
  certification: string;
  iso_3166_1: string;
}

export interface MovieDetail extends TMDBMovie {
  runtime: number;
  genres: Genre[];
  status: string;
  original_language: string;
  tagline: string;
  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  release_dates: {
    results: {
      iso_3166_1: string;
      release_dates: { certification: string }[];
    }[];
  };
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface TMDBMovie extends Movie {}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
