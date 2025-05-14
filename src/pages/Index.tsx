
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon, ListFilter, LogOut } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import { 
  searchMovies, 
  getSavedMovies, 
  getPartnerSavedMovies,
  getUserReview,
  getPartnerReview 
} from '@/services/movieService';
import { Movie, MovieReview, SavedMovie } from '@/types/movie';

interface MovieWithExtras {
  movie: Movie;
  userReview: MovieReview | null;
  partnerReview: MovieReview | null;
  userStatus: 'watched' | 'want-to-watch' | null;
}

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('explore');
  const [movies, setMovies] = useState<MovieWithExtras[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    loadMovies();
  }, [currentUser, activeTab]);

  const loadMovies = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    
    try {
      switch (activeTab) {
        case 'explore':
          const allMovies = await searchMovies('');
          const enrichedMovies = await Promise.all(
            allMovies.map(async (movie) => {
              const userReview = await getUserReview(currentUser.id, movie.id);
              const partnerReview = currentUser.partnerId 
                ? await getPartnerReview(currentUser.id, currentUser.partnerId, movie.id)
                : null;
              
              const userSavedMovies = await getSavedMovies(currentUser.id);
              const savedMovie = userSavedMovies.find(sm => sm.movie.id === movie.id)?.savedMovie;
              
              return {
                movie,
                userReview,
                partnerReview,
                userStatus: savedMovie?.status || null
              };
            })
          );
          setMovies(enrichedMovies);
          break;
          
        case 'watched':
          await loadUserMovies('watched');
          break;
          
        case 'watchlist':
          await loadUserMovies('want-to-watch');
          break;
          
        case 'partner':
          await loadPartnerMovies();
          break;
      }
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadUserMovies = async (status: 'watched' | 'want-to-watch') => {
    if (!currentUser) return;
    
    const userSavedMovies = await getSavedMovies(currentUser.id, status);
    
    const enrichedMovies = await Promise.all(
      userSavedMovies.map(async ({ movie, savedMovie }) => {
        const userReview = await getUserReview(currentUser.id, movie.id);
        const partnerReview = currentUser.partnerId 
          ? await getPartnerReview(currentUser.id, currentUser.partnerId, movie.id)
          : null;
        
        return {
          movie,
          userReview,
          partnerReview,
          userStatus: savedMovie.status
        };
      })
    );
    
    setMovies(enrichedMovies);
  };
  
  const loadPartnerMovies = async () => {
    if (!currentUser?.partnerId) {
      setMovies([]);
      return;
    }
    
    const partnerSavedMovies = await getPartnerSavedMovies(currentUser.partnerId);
    
    const enrichedMovies = await Promise.all(
      partnerSavedMovies.map(async ({ movie, savedMovie }) => {
        const userReview = await getUserReview(currentUser.id, movie.id);
        const partnerReview = await getUserReview(currentUser.partnerId!, movie.id);
        
        // Get user's status for this movie
        const userSavedMovies = await getSavedMovies(currentUser.id);
        const userSavedMovie = userSavedMovies.find(sm => sm.movie.id === movie.id)?.savedMovie;
        
        return {
          movie,
          userReview,
          partnerReview,
          userStatus: userSavedMovie?.status || null
        };
      })
    );
    
    setMovies(enrichedMovies);
  };

  const handleSearch = async (query: string) => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const searchResults = await searchMovies(query);
      
      const enrichedMovies = await Promise.all(
        searchResults.map(async (movie) => {
          const userReview = await getUserReview(currentUser.id, movie.id);
          const partnerReview = currentUser.partnerId 
            ? await getPartnerReview(currentUser.id, currentUser.partnerId, movie.id)
            : null;
          
          const userSavedMovies = await getSavedMovies(currentUser.id);
          const savedMovie = userSavedMovies.find(sm => sm.movie.id === movie.id)?.savedMovie;
          
          return {
            movie,
            userReview,
            partnerReview,
            userStatus: savedMovie?.status || null
          };
        })
      );
      
      setMovies(enrichedMovies);
      setActiveTab('explore');
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  const handleAddMovie = () => {
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* App Header */}
      <header className="bg-wine p-4 sticky top-0 z-10 shadow-md">
        <div className="container max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">CoupleWatch</h1>
          
          <div className="flex items-center gap-2">
            {currentUser && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-wine-light"
                  onClick={() => navigate('/profile')}
                >
                  {currentUser.name}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-wine-light"
                  onClick={logout}
                >
                  <LogOut size={20} />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container max-w-3xl mx-auto p-4 pb-24">
        {/* Search Bar */}
        <div className="my-4">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="watched">Watched</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="partner">Partner</TabsTrigger>
          </TabsList>
          
          {/* Tab Content */}
          {['explore', 'watched', 'watchlist', 'partner'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground animate-pulse-subtle">Loading movies...</p>
                </div>
              ) : movies.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No movies found in this category.</p>
                  {tab === 'partner' && !currentUser?.partnerId && (
                    <p className="mt-2">Connect with your partner in Profile to see their movies.</p>
                  )}
                  <Button 
                    onClick={handleAddMovie}
                    className="mt-4 bg-wine hover:bg-wine-dark"
                  >
                    <PlusIcon size={16} className="mr-1" /> Add Movies
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {movies.map((movieData) => (
                    <MovieCard
                      key={movieData.movie.id}
                      movie={movieData.movie}
                      userReview={movieData.userReview}
                      partnerReview={movieData.partnerReview}
                      userStatus={movieData.userStatus}
                      onClick={() => handleMovieClick(movieData.movie.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          className="h-14 w-14 rounded-full bg-wine hover:bg-wine-dark shadow-lg"
          onClick={handleAddMovie}
        >
          <PlusIcon size={24} />
        </Button>
      </div>
    </div>
  );
};

export default Index;
