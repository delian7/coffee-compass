import { LngLatLike, Map, Marker, MarkerOptions } from 'mapbox-gl';

export interface MapContextType {
  map: Map | null;
  markers: Marker[];
  userLocation: UserLocation | null;
  isMapLoaded: boolean;
  isLocatingUser: boolean;
  flyTo: (center: LngLatLike, zoom?: number) => void;
  addMarker: (lngLat: LngLatLike, options?: MarkerOptions) => Marker;
  removeMarker: (marker: Marker) => void;
  clearMarkers: () => void;
  getUserLocation: () => Promise<UserLocation>;
  zoomIn: () => void;
  zoomOut: () => void;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
