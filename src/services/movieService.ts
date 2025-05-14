
import { Movie, MovieReview, SavedMovie } from '../types/movie';

// Mock data for movie database
// In a real app, this would use The Movie Database API or similar
const MOCK_MOVIES: Movie[] = [
  {
    id: 'movie1',
    title: 'The Shawshank Redemption',
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    posterPath: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/avedvodAZUcwqevBfm8p4G2NziQ.jpg',
    releaseDate: '1994-09-23',
    voteAverage: 8.7,
    genres: ['Drama']
  },
  {
    id: 'movie2',
    title: 'The Godfather',
    overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    posterPath: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg',
    releaseDate: '1972-03-14',
    voteAverage: 8.7,
    genres: ['Crime', 'Drama']
  },
  {
    id: 'movie3',
    title: 'The Dark Knight',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterPath: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    releaseDate: '2008-07-16',
    voteAverage: 8.5,
    genres: ['Action', 'Crime', 'Drama', 'Thriller']
  },
  {
    id: 'movie4',
    title: 'Pulp Fiction',
    overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    posterPath: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    releaseDate: '1994-09-10',
    voteAverage: 8.5,
    genres: ['Crime', 'Drama']
  },
  {
    id: 'movie5',
    title: 'La La Land',
    overview: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
    posterPath: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/nadTlnTE6DdgmYsN4iWc2a2wiaI.jpg',
    releaseDate: '2016-11-09',
    voteAverage: 7.9,
    genres: ['Comedy', 'Drama', 'Romance', 'Music']
  },
  {
    id: 'movie6',
    title: 'The Notebook',
    overview: 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.',
    posterPath: 'https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/qom1SZSENdmHFNZBXbtJAU0WTlC.jpg',
    releaseDate: '2004-06-25',
    voteAverage: 7.9,
    genres: ['Drama', 'Romance']
  }
];

// Mock saved user data
let MOCK_SAVED_MOVIES: SavedMovie[] = [
  {
    movieId: 'movie1',
    userId: 'user1',
    status: 'watched',
    addedAt: '2023-01-15T18:30:00.000Z'
  },
  {
    movieId: 'movie3',
    userId: 'user1',
    status: 'want-to-watch',
    addedAt: '2023-02-20T14:15:00.000Z'
  },
  {
    movieId: 'movie2',
    userId: 'user2',
    status: 'watched',
    addedAt: '2023-01-10T20:00:00.000Z'
  },
  {
    movieId: 'movie5',
    userId: 'user2',
    status: 'want-to-watch',
    addedAt: '2023-03-05T17:45:00.000Z'
  }
];

// Mock reviews
let MOCK_REVIEWS: MovieReview[] = [
  {
    id: 'review1',
    movieId: 'movie1',
    userId: 'user1',
    userName: 'Alex',
    rating: 5,
    review: 'Absolutely incredible. One of the best films ever made.',
    watchedDate: '2023-01-15T00:00:00.000Z',
    createdAt: '2023-01-15T18:30:00.000Z'
  },
  {
    id: 'review2',
    movieId: 'movie2',
    userId: 'user2',
    userName: 'Jordan',
    rating: 4,
    review: 'A classic. Amazing performances all around.',
    watchedDate: '2023-01-10T00:00:00.000Z',
    createdAt: '2023-01-10T20:00:00.000Z'
  }
];

// Movie service functions
export const searchMovies = async (query: string): Promise<Movie[]> => {
  // Mock search functionality
  if (!query) return MOCK_MOVIES;
  
  const lowerQuery = query.toLowerCase();
  return MOCK_MOVIES.filter(movie => 
    movie.title.toLowerCase().includes(lowerQuery) || 
    movie.overview.toLowerCase().includes(lowerQuery) ||
    movie.genres.some(genre => genre.toLowerCase().includes(lowerQuery))
  );
};

export const getMovieById = async (id: string): Promise<Movie | null> => {
  return MOCK_MOVIES.find(movie => movie.id === id) || null;
};

export const getSavedMovies = async (userId: string, status?: 'watched' | 'want-to-watch'): Promise<{movie: Movie, savedMovie: SavedMovie}[]> => {
  const userSavedMovies = MOCK_SAVED_MOVIES.filter(
    sm => sm.userId === userId && (!status || sm.status === status)
  );
  
  return Promise.all(userSavedMovies.map(async savedMovie => {
    const movie = await getMovieById(savedMovie.movieId);
    if (!movie) throw new Error(`Movie not found: ${savedMovie.movieId}`);
    return { movie, savedMovie };
  }));
};

export const getPartnerSavedMovies = async (partnerId: string, status?: 'watched' | 'want-to-watch'): Promise<{movie: Movie, savedMovie: SavedMovie}[]> => {
  if (!partnerId) return [];
  
  return getSavedMovies(partnerId, status);
};

export const saveMovie = async (
  userId: string, 
  movieId: string, 
  status: 'watched' | 'want-to-watch'
): Promise<void> => {
  // Check if already saved
  const existingSavedMovie = MOCK_SAVED_MOVIES.find(
    sm => sm.userId === userId && sm.movieId === movieId
  );
  
  if (existingSavedMovie) {
    // Update status if different
    if (existingSavedMovie.status !== status) {
      MOCK_SAVED_MOVIES = MOCK_SAVED_MOVIES.map(sm => 
        sm.userId === userId && sm.movieId === movieId 
          ? { ...sm, status, addedAt: new Date().toISOString() }
          : sm
      );
    }
  } else {
    // Add new saved movie
    MOCK_SAVED_MOVIES.push({
      userId,
      movieId,
      status,
      addedAt: new Date().toISOString()
    });
  }
};

export const removeMovie = async (userId: string, movieId: string): Promise<void> => {
  MOCK_SAVED_MOVIES = MOCK_SAVED_MOVIES.filter(
    sm => !(sm.userId === userId && sm.movieId === movieId)
  );
};

export const getMovieReviews = async (movieId: string): Promise<MovieReview[]> => {
  return MOCK_REVIEWS.filter(review => review.movieId === movieId);
};

export const getUserReview = async (userId: string, movieId: string): Promise<MovieReview | null> => {
  return MOCK_REVIEWS.find(
    review => review.userId === userId && review.movieId === movieId
  ) || null;
};

export const saveReview = async (
  userId: string,
  userName: string,
  movieId: string,
  rating: number,
  review: string,
  watchedDate: string
): Promise<MovieReview> => {
  const existingReview = MOCK_REVIEWS.find(
    r => r.userId === userId && r.movieId === movieId
  );
  
  if (existingReview) {
    // Update existing review
    const updatedReview = {
      ...existingReview,
      rating,
      review,
      watchedDate,
      createdAt: new Date().toISOString()
    };
    
    MOCK_REVIEWS = MOCK_REVIEWS.map(r => 
      r.id === existingReview.id ? updatedReview : r
    );
    
    return updatedReview;
  } else {
    // Create new review
    const newReview: MovieReview = {
      id: `review${MOCK_REVIEWS.length + 1}`,
      userId,
      userName,
      movieId,
      rating,
      review,
      watchedDate,
      createdAt: new Date().toISOString()
    };
    
    MOCK_REVIEWS.push(newReview);
    
    // Also ensure movie is marked as watched
    await saveMovie(userId, movieId, 'watched');
    
    return newReview;
  }
};

// Helper for getting user's partner's review of a movie
export const getPartnerReview = async (
  userId: string, 
  partnerId: string | undefined, 
  movieId: string
): Promise<MovieReview | null> => {
  if (!partnerId) return null;
  
  return getUserReview(partnerId, movieId);
};
