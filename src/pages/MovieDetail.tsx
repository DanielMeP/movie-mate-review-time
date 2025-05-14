
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getMovieById, 
  getUserReview, 
  getPartnerReview, 
  saveReview, 
  saveMovie,
  removeMovie
} from '@/services/movieService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  ChevronLeft,
  Star,
  CheckCircle,
  PlusCircle,
  ListPlus,
  Calendar,
  Trash2
} from 'lucide-react';
import StarRating from '@/components/StarRating';
import { Movie, MovieReview } from '@/types/movie';
import { format } from 'date-fns';

const MovieDetail = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [userReview, setUserReview] = useState<MovieReview | null>(null);
  const [partnerReview, setPartnerReview] = useState<MovieReview | null>(null);
  const [userStatus, setUserStatus] = useState<'watched' | 'want-to-watch' | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [watchedDate, setWatchedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    loadMovieData();
  }, [movieId, currentUser]);

  const loadMovieData = async () => {
    if (!movieId || !currentUser) return;
    
    setLoading(true);
    try {
      const fetchedMovie = await getMovieById(movieId);
      if (!fetchedMovie) {
        toast.error('Movie not found');
        navigate('/');
        return;
      }
      
      setMovie(fetchedMovie);
      
      const userReviewData = await getUserReview(currentUser.id, movieId);
      setUserReview(userReviewData);
      
      if (userReviewData) {
        setRating(userReviewData.rating);
        setReviewText(userReviewData.review);
        setWatchedDate(format(new Date(userReviewData.watchedDate), 'yyyy-MM-dd'));
        setUserStatus('watched');
      } else {
        // Check if movie is in watchlist
        try {
          const response = await fetch(`/api/user/movies?userId=${currentUser.id}&movieId=${movieId}`);
          const data = await response.json();
          if (data.status === 'want-to-watch') {
            setUserStatus('want-to-watch');
          } else if (data.status === 'watched') {
            setUserStatus('watched');
          }
        } catch (error) {
          console.error('Error checking movie status:', error);
        }
      }
      
      if (currentUser.partnerId) {
        const partnerReviewData = await getPartnerReview(
          currentUser.id,
          currentUser.partnerId,
          movieId
        );
        setPartnerReview(partnerReviewData);
      }
    } catch (error) {
      console.error('Error loading movie:', error);
      toast.error('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!currentUser || !movie) return;
    
    try {
      await saveMovie(currentUser.id, movie.id, 'want-to-watch');
      setUserStatus('want-to-watch');
      toast.success('Added to your watchlist');
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist');
    }
  };

  const handleMarkAsWatched = async () => {
    if (!currentUser || !movie) return;
    
    try {
      await saveMovie(currentUser.id, movie.id, 'watched');
      setUserStatus('watched');
      toast.success('Marked as watched');
      
      // Open review dialog
      setReviewDialogOpen(true);
    } catch (error) {
      console.error('Error marking as watched:', error);
      toast.error('Failed to mark as watched');
    }
  };

  const handleRemoveMovie = async () => {
    if (!currentUser || !movie) return;
    
    try {
      await removeMovie(currentUser.id, movie.id);
      setUserStatus(null);
      setUserReview(null);
      toast.success('Removed from your lists');
    } catch (error) {
      console.error('Error removing movie:', error);
      toast.error('Failed to remove movie');
    }
  };

  const handleSubmitReview = async () => {
    if (!currentUser || !movie) return;
    
    try {
      const newReview = await saveReview(
        currentUser.id,
        currentUser.name,
        movie.id,
        rating,
        reviewText,
        new Date(watchedDate).toISOString()
      );
      
      setUserReview(newReview);
      setUserStatus('watched');
      setReviewDialogOpen(false);
      toast.success('Review saved');
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Failed to save review');
    }
  };

  if (loading || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse-subtle">Loading movie details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Movie Hero Section with Backdrop */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center" 
        style={{ backgroundImage: `url(${movie.backdropPath})` }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        
        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-black/30 hover:bg-black/50 text-white rounded-full"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
          </Button>
        </div>
      </div>
      
      <div className="container max-w-3xl mx-auto px-4 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <img 
              src={movie.posterPath} 
              alt={movie.title}
              className="movie-poster w-40 md:w-52 rounded-md shadow-lg"
            />
          </div>
          
          {/* Movie Info */}
          <div className="flex-grow">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              <span>{movie.genres.join(', ')}</span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-gold" size={20} fill="currentColor" />
              <span className="font-semibold">{movie.voteAverage.toFixed(1)}</span>
              <span className="text-muted-foreground">/ 10</span>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {userStatus === 'watched' ? (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setReviewDialogOpen(true)}
                >
                  <CheckCircle size={18} className="text-green-500" />
                  {userReview ? 'Edit Review' : 'Add Review'}
                </Button>
              ) : userStatus === 'want-to-watch' ? (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleMarkAsWatched}
                >
                  <CheckCircle size={18} />
                  Mark as Watched
                </Button>
              ) : (
                <>
                  <Button 
                    className="flex items-center gap-2 bg-wine hover:bg-wine-dark"
                    onClick={handleMarkAsWatched}
                  >
                    <CheckCircle size={18} />
                    Watched
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleAddToWatchlist}
                  >
                    <ListPlus size={18} />
                    Add to Watchlist
                  </Button>
                </>
              )}
              
              {userStatus && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={handleRemoveMovie}
                >
                  <Trash2 size={16} />
                  Remove
                </Button>
              )}
            </div>
            
            {/* Overview */}
            <p className="text-sm md:text-base mb-6">{movie.overview}</p>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          
          <Tabs defaultValue="your-review">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="your-review">Your Review</TabsTrigger>
              <TabsTrigger value="partner-review">Partner Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="your-review" className="mt-4">
              {userReview ? (
                <div className="bg-card rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StarRating initialRating={userReview.rating} disabled size="sm" />
                      <span className="font-medium">{userReview.rating}/5</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(userReview.watchedDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm">{userReview.review}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  {userStatus === 'watched' ? (
                    <div>
                      <p className="text-muted-foreground mb-4">You haven't reviewed this movie yet.</p>
                      <Button 
                        onClick={() => setReviewDialogOpen(true)}
                        className="bg-wine hover:bg-wine-dark"
                      >
                        <PlusCircle size={16} className="mr-2" />
                        Write a Review
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted-foreground mb-4">Mark this movie as watched to leave a review.</p>
                      <Button 
                        onClick={handleMarkAsWatched}
                        className="bg-wine hover:bg-wine-dark"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        I've Watched This
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="partner-review" className="mt-4">
              {!currentUser?.partnerId ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Connect with your partner to see their reviews.</p>
                  <Button 
                    onClick={() => navigate('/profile')}
                    className="bg-wine hover:bg-wine-dark"
                  >
                    Go to Profile
                  </Button>
                </div>
              ) : partnerReview ? (
                <div className="bg-card rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-wine">{currentUser.partnerName}</span>
                      <span className="mx-1">•</span>
                      <StarRating initialRating={partnerReview.rating} disabled size="sm" />
                      <span className="font-medium">{partnerReview.rating}/5</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(partnerReview.watchedDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm">{partnerReview.review}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {currentUser.partnerName} hasn't reviewed this movie yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {userReview ? 'Edit your review' : 'Add your review'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex items-center gap-2">
                <StarRating 
                  initialRating={rating} 
                  onChange={setRating}
                  size="lg"
                />
                <span className="ml-2 text-sm font-medium">
                  {rating > 0 ? `${rating}/5` : 'Select rating'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">When did you watch it?</label>
              <div className="flex">
                <input
                  type="date"
                  value={watchedDate}
                  onChange={(e) => setWatchedDate(e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Review</label>
              <Textarea 
                placeholder="Share your thoughts about the movie..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-wine hover:bg-wine-dark"
              onClick={handleSubmitReview}
              disabled={rating === 0}
            >
              Save Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MovieDetail;
