
export interface Movie {
  id: string;
  title: string;
  overview: string;
  posterPath: string;
  backdropPath?: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
}

export interface MovieReview {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  review: string;
  watchedDate: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface SavedMovie {
  movieId: string;
  userId: string;
  status: 'watched' | 'want-to-watch';
  addedAt: string; // ISO date string
}
