
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { Movie, MovieReview } from '@/types/movie';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  userReview?: MovieReview | null;
  partnerReview?: MovieReview | null;
  userStatus?: 'watched' | 'want-to-watch' | null;
  onClick?: () => void;
  compact?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  userReview, 
  partnerReview, 
  userStatus,
  onClick,
  compact = false
}) => {
  return (
    <Card 
      className={cn(
        "movie-card overflow-hidden h-full cursor-pointer transition-all",
        compact ? "w-36" : "w-full"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={movie.posterPath} 
          alt={movie.title}
          className="movie-poster w-full h-auto"
        />
        
        {userStatus && (
          <div className={cn(
            "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium",
            userStatus === 'watched' ? "bg-green-500/90 text-white" : "bg-blue-500/90 text-white"
          )}>
            {userStatus === 'watched' ? 'Watched' : 'Watchlist'}
          </div>
        )}
      </div>
      
      <CardContent className={cn("p-3", compact ? "p-2" : "p-4")}>
        <h3 className={cn(
          "font-semibold line-clamp-1 mb-1", 
          compact ? "text-sm" : "text-lg"
        )}>
          {movie.title}
        </h3>
        
        {!compact && (
          <p className="text-muted-foreground text-xs mb-2">
            {new Date(movie.releaseDate).getFullYear()} • {movie.genres.join(', ')}
          </p>
        )}
        
        <div className="flex items-center gap-4 mt-2">
          {userReview && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium">You:</span>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon 
                  key={`user-star-${i}`}
                  size={14}
                  className={i < userReview.rating ? "gold-star" : "empty-star"}
                  fill={i < userReview.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
          )}
          
          {partnerReview && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium">Partner:</span>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon 
                  key={`partner-star-${i}`}
                  size={14}
                  className={i < partnerReview.rating ? "gold-star" : "empty-star"}
                  fill={i < partnerReview.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
