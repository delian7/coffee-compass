import { VenueCard } from '@/components/venues/VenueCard';
import { useVenues } from '@/hooks/use-venues';
import { Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function VenueList() {
  const { filteredVenues, isLoading } = useVenues();
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 text-coffee-primary animate-spin" />
      </div>
    );
  }
  
  if (filteredVenues.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-2">No venues found</p>
        <p className="text-sm text-gray-400">Try adjusting your filters</p>
      </div>
    );
  }
  
  return (
    <div className="venue-list p-4">
      <h2 className="font-poppins font-semibold text-lg mb-3 px-2">
        {filteredVenues.length > 0 
          ? `Nearby Venues (${filteredVenues.length})` 
          : 'No venues found'}
      </h2>
      
      {filteredVenues.map((venue) => (
        <VenueCard 
          key={venue.id} 
          venue={venue} 
          isMobile={isMobile} 
        />
      ))}
    </div>
  );
}
