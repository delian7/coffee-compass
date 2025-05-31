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
    console.log('Getting user location...');

    // Remove previous user location marker if it exists
    markers.forEach(marker => {
      if (marker.getElement().classList.contains('user-location-marker')) {
        marker.remove();
      }
    });

    try {
      const location = await getLocation();
      console.log('Received location:', location);
      setUserLocation(location);

      // Create wrapper element
      const wrapper = document.createElement('div');
      wrapper.className = 'user-location-marker relative';
      wrapper.style.width = '20px';
      wrapper.style.height = '20px';

      // Create pulse effect
      const pulse = document.createElement('div');
      pulse.style.position = 'absolute';
      pulse.style.width = '20px';
      pulse.style.height = '20px';
      pulse.style.backgroundColor = '#3B82F6';
      pulse.style.borderRadius = '50%';
      pulse.style.opacity = '0.5';
      pulse.style.animation = 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite';

      // Create dot
      const dot = document.createElement('div');
      dot.style.position = 'absolute';
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.backgroundColor = '#3B82F6';
      dot.style.borderRadius = '50%';
      dot.style.border = '2px solid white';
      dot.style.left = '4px';
      dot.style.top = '4px';

      // Combine elements
      wrapper.appendChild(pulse);
      wrapper.appendChild(dot);

      // Add custom marker to map
      if (map) {
        console.log('Adding marker at:', [location.longitude, location.latitude]);
        const marker = new mapboxgl.Marker({
          element: wrapper,
          anchor: 'center'
        })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map);

        console.log('Marker added:', marker);
        setMarkers(prev => [...prev, marker]);
        flyTo([location.longitude, location.latitude]);
      } else {
        console.error('Map is not initialized');
      }

      return location;
    } catch (error) {
      console.error('Error in getUserLocation:', error);
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
