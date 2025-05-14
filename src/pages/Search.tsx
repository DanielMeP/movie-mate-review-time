
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { searchMovies, getUserReview, getPartnerReview } from '@/services/movieService';
import { Movie } from '@/types/movie';

const Search = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchMovies(query);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-wine p-4 sticky top-0 z-10 shadow-md">
        <div className="container max-w-3xl mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white mr-2 hover:bg-wine-light"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
          </Button>
          
          <h1 className="text-lg font-semibold text-white">Search Movies</h1>
        </div>
      </header>
      
      {/* Search Section */}
      <div className="container max-w-3xl mx-auto p-4">
        <div className="my-4">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search by title, genre, or description..."
          />
        </div>
        
        {/* Results */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground animate-pulse-subtle">Searching movies...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {searchResults.map(movie => (
                <MovieCard 
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie.id)}
                />
              ))}
            </div>
          ) : hasSearched ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No movies found. Try another search.</p>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Search for movies to add to your lists.</p>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Popular Genres to Explore</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Action', 'Comedy', 'Drama', 'Romance', 'Sci-Fi', 'Thriller'].map(genre => (
                    <Button 
                      key={genre}
                      variant="outline"
                      onClick={() => handleSearch(genre)}
                      className="m-1"
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
