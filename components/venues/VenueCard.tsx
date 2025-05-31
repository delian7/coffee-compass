import { Card, CardContent } from '@/components/ui/card';
import { Venue } from '@/types/venues';
import { Rating } from '@/components/ui/rating';
import { useVenues } from '@/hooks/use-venues';
import { useMap } from '@/hooks/use-user-location';
import {
  getVenueTypeLabel,
  getVenueTypeColor,
  formatOpeningHours,
  formatDistance,
  truncateText
} from '@/lib/utils';
import { MapPin, Clock } from 'lucide-react';

interface VenueCardProps {
  venue: Venue;
  isMobile?: boolean;
}

export function VenueCard({ venue, isMobile = false }: VenueCardProps) {
  const { selectVenue } = useVenues();
  const { flyTo } = useMap();

  const handleClick = () => {
    selectVenue(venue);
    flyTo([venue.longitude, venue.latitude]);
  };

  if (isMobile) {
    return (
      <Card
        className="overflow-hidden mb-4 hover:shadow-lg transition-shadow cursor-pointer flex"
        onClick={handleClick}
      >
        <CardContent className="p-3 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-poppins font-semibold">{venue.name}</h3>
            <span className={`${getVenueTypeColor(venue.type)} text-white text-xs px-2 py-1 rounded-full`}>
              {getVenueTypeLabel(venue.type).split(' ')[0]}
            </span>
          </div>

          <Rating
            value={venue.rating || 0}
            reviewCount={venue.reviewCount}
            size="sm"
            className="mt-1"
          />

          <div className="flex items-center text-gray-600 text-xs mt-2">
            <MapPin className="h-3 w-3 mr-1 text-coffee-primary" />
            <span>{formatDistance(venue.distance)}</span>
            <span className="mx-2">•</span>
            <Clock className="h-3 w-3 mr-1" />
            <span>{venue.openingHours ? (checkIsOpen(venue.openingHours) ? 'Open' : 'Closed') : 'Hours N/A'}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="overflow-hidden mb-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-poppins font-semibold text-lg">{venue.name}</h3>
          <span className={`${getVenueTypeColor(venue.type)} text-white text-xs p-1 rounded-full`}>
            {getVenueTypeLabel(venue.type)}
          </span>
        </div>

        {/* <Rating
          value={venue.rating || 0}
          reviewCount={venue.reviewCount}
          className="mt-1"
        /> */}

        <p className="text-gray-600 text-sm mt-2">
          {truncateText(venue.description, 100)}
        </p>

        <div className="flex items-center text-gray-600 text-sm mt-3">
          {/* <MapPin className="h-4 w-4 mr-1 text-coffee-primary" /> */}
          {/* <span>{formatDistance(venue.distance)}</span> */}
          {/* <span className="mx-2">•</span> */}
          {/* <Clock className="h-4 w-4 mr-1" /> */}
          {/* <span>{formatOpeningHours(venue.openingHours)}</span> */}
        </div>
      </CardContent>
    </Card>
  );
}

function checkIsOpen(openingHours: string): boolean {
  // Simple check if current time is within opening hours
  // In a real app, this would be more sophisticated
  const now = new Date();
  const hour = now.getHours();

  // Assume format like "7AM - 9PM"
  const match = openingHours.match(/(\d+)(?:AM|PM)\s*-\s*(\d+)(?:AM|PM)/i);
  if (!match) return false;

  let openHour = parseInt(match[1], 10);
  let closeHour = parseInt(match[2], 10);

  // Adjust for PM times
  if (openingHours.includes('PM') && openHour < 12) openHour += 12;
  if (openingHours.includes('PM') && closeHour < 12) closeHour += 12;

  return hour >= openHour && hour < closeHour;
}
