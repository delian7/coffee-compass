import { useVenues } from '@/hooks/use-venues';
import { useMap } from '@/hooks/use-user-location';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Rating } from '@/components/ui/rating';
import { Button } from '@/components/ui/button';
import {
  getVenueTypeLabel,
  getVenueTypeColor,
  formatPhoneNumber
} from '@/lib/utils';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Globe,
  Navigation,
  Bookmark
} from 'lucide-react';

export function VenueDetails() {
  const { selectedVenue, selectVenue } = useVenues();
  const { flyTo } = useMap();

  const handleClose = () => {
    selectVenue(null);
  };

  const handleGetDirections = () => {
    if (selectedVenue) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedVenue.latitude},${selectedVenue.longitude}`;
      window.open(url, '_blank');
    }
  };

  if (!selectedVenue) return null;

  return (
    <Dialog open={!!selectedVenue} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="p-0 max-w-lg w-full max-h-[90vh] overflow-hidden rounded-xl">
        <div className="relative">
          {/* <img
            src={selectedVenue.imageUrl || `https://source.unsplash.com/1200x600/?${selectedVenue.type},cafe,exterior`}
            alt={`${selectedVenue.name} exterior`}
            className="w-full h-56 object-cover"
          /> */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <span className={`absolute bottom-4 left-4 ${getVenueTypeColor(selectedVenue.type)} text-white text-sm px-3 py-1 rounded-full`}>
            {getVenueTypeLabel(selectedVenue.type)}
          </span>
        </div>

        <div className="p-6">
          <h2 className="font-poppins font-bold text-2xl text-coffee-dark mb-2">
            {selectedVenue.name}
          </h2>

          <div className="flex items-center mb-4">
            <span className="text-gray-600 text-sm italic">{selectedVenue.experienceLevel}</span>

            {/* <Rating
              value={selectedVenue.rating || 0}
              reviewCount={selectedVenue.reviewCount}
              size="lg"
              className="mr-3"
            /> */}

            {selectedVenue.priceLevel && (
              <>
                <span className="text-gray-600 text-sm">{selectedVenue.priceLevel}</span>
                <span className="mx-2 text-gray-400">•</span>
              </>
            )}

            {/* {selectedVenue.openingHours ? (
              <span className="text-green-600 text-sm font-medium">
                Open until {selectedVenue.openingHours.split('-')[1]?.trim() || 'closing time'}
              </span>
            ) : (
              <span className="text-gray-600 text-sm">Hours not available</span>
            )} */}
          </div>

          {selectedVenue.tags && selectedVenue.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap">
              {selectedVenue.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-coffee-dark text-xs px-3 py-1 rounded-full mr-2 mb-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-600 mb-4">
            {selectedVenue.description}
          </p>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mt-1 mr-3 text-coffee-primary" />
              <div>
                <p className="text-gray-800">{selectedVenue.address}</p>
                {/* {selectedVenue.distance !== undefined && (
                  <p className="text-gray-600 text-sm">{selectedVenue.distance} miles away</p>
                )} */}
              </div>
            </div>

            {selectedVenue.openingHours && (
              <div className="flex items-start">
                <Clock className="h-5 w-5 mt-1 mr-3 text-coffee-primary" />
                <div>
                  <p className="text-gray-800">{selectedVenue.openingHours}</p>
                </div>
              </div>
            )}

            {selectedVenue.phoneNumber && (
              <div className="flex items-start">
                <Phone className="h-5 w-5 mt-1 mr-3 text-coffee-primary" />
                <p className="text-gray-800">{formatPhoneNumber(selectedVenue.phoneNumber)}</p>
              </div>
            )}

            {selectedVenue.website && (
              <div className="flex items-start">
                <Globe className="h-5 w-5 mt-1 mr-3 text-coffee-primary" />
                <a
                  href={selectedVenue.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coffee-primary hover:underline"
                >
                  {selectedVenue.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
          </div>

          <div className="mt-6 flex space-x-3">
            <Button
              className="bg-coffee-primary text-white py-2 px-4 rounded-lg flex-1 hover:bg-opacity-90"
              onClick={handleGetDirections}
            >
              <Navigation className="h-4 w-4 mr-2" /> Directions
            </Button>

            {/* <Button
              variant="outline"
              className="bg-gray-200 text-coffee-dark py-2 px-4 rounded-lg flex-1 hover:bg-gray-300 border-0"
            >
              <Bookmark className="h-4 w-4 mr-2" /> Save
            </Button> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
