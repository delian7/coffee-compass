import { useEffect, useState } from 'react';
import { useMap } from '@/hooks/use-user-location';
import mapboxgl from 'mapbox-gl';

export default function MapDebugger() {
  const {
    isMapLoaded,
    map
  } = useMap();

  const [debugInfo, setDebugInfo] = useState({
    containerExists: false,
    mapInstance: false,
    mapLoaded: false,
    mapboxLibraryLoaded: false,
    dimensions: { width: 0, height: 0 },
    token: '...' + (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.slice(-6) || 'not-set'),
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      const container = document.getElementById('map');
      setDebugInfo({
        containerExists: !!container,
        mapInstance: !!map,
        mapLoaded: isMapLoaded,
        mapboxLibraryLoaded: typeof mapboxgl !== 'undefined',
        dimensions: {
          width: container?.clientWidth || 0,
          height: container?.clientHeight || 0,
        },
        token: '...' + (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.slice(-6) || 'not-set'),
      });
    };

    updateDebugInfo();

    // Update every 2 seconds
    const intervalId = setInterval(updateDebugInfo, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [map, isMapLoaded]);

  return (
    <div className="absolute top-0 left-0 z-50 bg-white/90 p-4 m-4 rounded-lg shadow-lg text-sm font-mono">
      <h3 className="font-bold mb-2">Map Debug Info:</h3>
      <ul className="space-y-1">
        <li>Container: {debugInfo.containerExists ? '✅' : '❌'}</li>
        <li>Map Instance: {debugInfo.mapInstance ? '✅' : '❌'}</li>
        <li>Map Loaded: {debugInfo.mapLoaded ? '✅' : '❌'}</li>
        <li>Mapbox Library: {debugInfo.mapboxLibraryLoaded ? '✅' : '❌'}</li>
        <li>Dimensions: {debugInfo.dimensions.width}x{debugInfo.dimensions.height}</li>
        <li>Token: {debugInfo.token}</li>
      </ul>
    </div>
  );
}