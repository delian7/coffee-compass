import { useEffect, useRef, useState } from 'react';
import { useMap } from '@/hooks/use-user-location';
import { useVenues } from '@/hooks/use-venues';
import { Venue } from '@/types/venues';
import { Button } from '@/components/ui/button';
import { createMarkerElement } from '@/lib/mapbox';
import VenueMarker from '@/components/map/VenueMarker';
import MapDebugger from '@/components/map/MapDebugger';
import { Loader2, MapPin, Plus, Minus, RefreshCw } from 'lucide-react';

export default function MapView() {
  const {
    isMapLoaded,
    isLocatingUser,
    getUserLocation,
    zoomIn,
    zoomOut,
    map,
    clearMarkers
  } = useMap();

  const {
    filteredVenues,
    selectVenue,
    selectedVenue,
    isLoading: isLoadingVenues,
    refreshVenues
  } = useVenues();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const markersRef = useRef<Map<number, any>>(new Map());

  // Update markers when filtered venues change
  useEffect(() => {
    if (!isMapLoaded || !map) return;

    // Clear all existing markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current.clear();

    // Add markers for filtered venues
    filteredVenues.forEach((venue: Venue) => {
      // Create a new marker
      const marker = new VenueMarker({
        venue,
        onClick: () => selectVenue(venue),
        isSelected: selectedVenue?.id === venue.id
      });

      // Add to map
      marker.addTo(map);

      // Store reference
      markersRef.current.set(venue.id, marker);
    });

    // Cleanup
    return () => {
      markersRef.current.forEach((marker) => {
        marker.remove();
      });
      markersRef.current.clear();
    };
  }, [filteredVenues, isMapLoaded, map, selectVenue, selectedVenue]);

  // Handle refreshing venues
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshVenues();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div
        id="map"
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      ></div>

      {/* Map controls */}
      <div className="absolute z-10 top-4 right-4 md:top-6 md:right-6 flex flex-col gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white shadow-lg hover:bg-gray-100"
          onClick={() => getUserLocation()}
          disabled={isLocatingUser}
        >
          {isLocatingUser ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5 text-coffee-primary" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white shadow-lg hover:bg-gray-100"
          onClick={zoomIn}
        >
          <Plus className="h-5 w-5 text-coffee-primary" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white shadow-lg hover:bg-gray-100"
          onClick={zoomOut}
        >
          <Minus className="h-5 w-5 text-coffee-primary" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full bg-white shadow-lg hover:bg-gray-100"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-5 w-5 text-coffee-primary ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Loading overlay */}
      {(isLoadingVenues || !isMapLoaded) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-coffee-primary animate-spin mb-4" />
            <p className="text-coffee-primary font-medium">Loading coffee shops...</p>
          </div>
        </div>
      )}
    </div>
  );
}
