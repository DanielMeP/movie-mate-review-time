
import { useState } from 'react';
import { StarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ 
  initialRating = 0, 
  onChange, 
  disabled = false,
  size = 'md'
}: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (index: number) => {
    if (disabled) return;
    const newRating = index === rating ? index - 1 : index;
    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  const getStarSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 24;
      default: return 20;
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((index) => (
        <StarIcon
          key={index}
          size={getStarSize()}
          className={cn(
            "cursor-pointer transition-colors",
            (hoverRating >= index || (!hoverRating && rating >= index)) 
              ? "gold-star" 
              : "empty-star",
            disabled && "opacity-70 cursor-default"
          )}
          fill={(hoverRating >= index || (!hoverRating && rating >= index)) ? "currentColor" : "none"}
          onClick={() => handleClick(index)}
          onMouseEnter={() => !disabled && setHoverRating(index)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

export default StarRating;
