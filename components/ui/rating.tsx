import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCount?: boolean;
}

export function Rating({
  value,
  reviewCount,
  size = 'md',
  className,
  showCount = true,
}: RatingProps) {
  // Calculate full and half stars
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  
  // Determine star size
  const starSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];
  
  // Determine text size
  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];
  
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex text-yellow-500">
        {/* Render full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={cn(starSize, "fill-current")} />
        ))}
        
        {/* Render half star if needed */}
        {hasHalfStar && <StarHalf className={cn(starSize, "fill-current")} />}
        
        {/* Render empty stars */}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <Star key={`empty-${i}`} className={cn(starSize, "text-gray-300")} />
        ))}
      </div>
      
      {/* Show review count if available */}
      {showCount && reviewCount !== undefined && (
        <span className={cn("text-gray-600 ml-1", textSize)}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
