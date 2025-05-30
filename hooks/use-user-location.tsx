import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import mapboxgl, { LngLatLike, Map as MapboxMap, Marker, MarkerOptions } from 'mapbox-gl';
import { defaultMapOptions, getUserLocation as getLocation } from '@/lib/mapbox';
import { MapContextType, UserLocation } from '@/types/mapbox';
import { useToast } from '@/hooks/use-toast';

// Create map context
const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<MapboxMap | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const { toast } = useToast();

  // Initialize map on component mount
  useEffect(() => {
    // Wait for the container to be available
    const initializeMap = () => {
      const container = document.getElementById('map');
      if (!container) {
        console.error('Map container not found, retrying...');
        return setTimeout(initializeMap, 100);
      }

      // Create new map instance
      try {
        console.log('Initializing Mapbox map...');
        const mapInstance = new mapboxgl.Map({
          ...defaultMapOptions,
          container,
        });

        // Add navigation control
        mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        // Set map state when loaded
        mapInstance.on('load', () => {
          console.log('Map loaded successfully!');
          setIsMapLoaded(true);
        });

        // Store map instance in state
        setMap(mapInstance);

        // Cleanup on unmount
        return () => {
          console.log('Cleaning up map instance');
          mapInstance.remove();
        };
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Start initialization
    const timeoutId = setTimeout(initializeMap, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Fly to a location
  const flyTo = (center: LngLatLike, zoom = 15) => {
    if (map) {
      map.flyTo({
        center,
        zoom,
        essential: true,
        duration: 1000,
      });
    }
  };

  // Add a marker to the map
  const addMarker = useCallback((lngLat: LngLatLike, options: MarkerOptions = {}) => {
    if (!map) throw new Error('Map is not initialized');

    const marker = new mapboxgl.Marker(options)
      .setLngLat(lngLat)
      .addTo(map);

    setMarkers(prev => [...prev, marker]);
    return marker;
  }, [map]);

  // Remove a marker
  const removeMarker = useCallback((marker: Marker) => {
    marker.remove();
    setMarkers(prev => prev.filter(m => m !== marker));
  }, []);

  // Clear all markers
  const clearMarkers = useCallback(() => {
    markers.forEach(marker => marker.remove());
    setMarkers([]);
  }, [markers]);

  // Get user's location
  const getUserLocation = async (): Promise<UserLocation> => {
    setIsLocatingUser(true);

    try {
      const location = await getLocation();
      setUserLocation(location);

      // Center map on user location
      if (map) {
        flyTo([location.longitude, location.latitude]);
      }

      return location;
    } catch (error) {
      console.error('Error getting user location:', error);
      toast({
        title: 'Location Error',
        description: 'Unable to get your location. Please check your browser permissions.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLocatingUser(false);
    }
  };

  // Zoom controls
  const zoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const zoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  return (
    <MapContext.Provider
      value={{
        map,
        markers,
        userLocation,
        isMapLoaded,
        isLocatingUser,
        flyTo,
        addMarker,
        removeMarker,
        clearMarkers,
        getUserLocation,
        zoomIn,
        zoomOut,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}
