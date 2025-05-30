import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VenueType } from '@/types/venues';

interface FilterButtonProps {
  label: string;
  type: VenueType | 'all';
  isActive: boolean;
  onClick: (type: VenueType | 'all') => void;
  className?: string;
}

export function FilterButton({ 
  label, 
  type, 
  isActive, 
  onClick, 
  className 
}: FilterButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={cn(
        "rounded-full font-medium whitespace-nowrap",
        isActive 
          ? "bg-coffee-primary text-white hover:bg-coffee-primary/90" 
          : "bg-gray-200 text-coffee-dark hover:bg-gray-300 border-0",
        className
      )}
      onClick={() => onClick(type)}
    >
      {label}
    </Button>
  );
}

export function FilterButtonGroup({ 
  activeType, 
  onFilterChange,
  className
}: {
  activeType: VenueType | 'all';
  onFilterChange: (type: VenueType | 'all') => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <FilterButton
        label="All Venues"
        type="all"
        isActive={activeType === 'all'}
        onClick={onFilterChange}
      />
      <FilterButton
        label="Coffee Shops"
        type="coffee"
        isActive={activeType === 'coffee'}
        onClick={onFilterChange}
      />
      <FilterButton
        label="Restaurants"
        type="restaurant"
        isActive={activeType === 'restaurant'}
        onClick={onFilterChange}
      />
      <FilterButton
        label="Bars"
        type="bar"
        isActive={activeType === 'bar'}
        onClick={onFilterChange}
      />
    </div>
  );
}
