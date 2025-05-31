import mapboxgl from 'mapbox-gl';
import { UserLocation } from '@/types/mapbox';

// Set Mapbox access token from env var with fallback
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
// Initialize Mapbox
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// Default map options
export const defaultMapOptions = {
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-122.3842, 47.6686] as [number, number], // Ballard
  zoom: 12,
  minZoom: 10,
  maxZoom: 18,
};

// Custom marker colors
export const markerColors = {
  coffee: '#6F4E37',
  restaurant: '#FF6B6B',
  bar: '#5D5D9E',
  user: '#4A89DC',
};

// Create a custom marker element
export function createMarkerElement(type: 'coffee' | 'restaurant' | 'bar' | 'user'): HTMLElement {
  const marker = document.createElement('div');
  marker.className = 'mapbox-marker';
  marker.style.width = '30px';
  marker.style.height = '30px';
  marker.style.borderRadius = '50%';
  marker.style.backgroundColor = markerColors[type];
  marker.style.border = '2px solid white';
  marker.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  marker.style.cursor = 'pointer';
  marker.style.transition = 'all 0.2s ease';

  // Type-specific icon
  const icon = document.createElement('i');
  icon.style.position = 'absolute';
  icon.style.top = '50%';
  icon.style.left = '50%';
  icon.style.transform = 'translate(-50%, -50%)';
  icon.style.color = 'white';
  icon.style.fontSize = '14px';

  switch (type) {
    case 'coffee':
      icon.className = 'fas fa-mug-hot';
      break;
    case 'restaurant':
      icon.className = 'fas fa-utensils';
      break;
    case 'bar':
      icon.className = 'fas fa-glass-martini-alt';
      break;
    case 'user':
      icon.className = 'fas fa-map-marker-alt';
      marker.style.zIndex = '100';
      break;
  }

  marker.appendChild(icon);

  marker.onmouseenter = () => {
    marker.style.width = '33px';  // 10% larger
    marker.style.height = '33px';
  };

  marker.onmouseleave = () => {
    marker.style.width = '30px';
    marker.style.height = '30px';
  };

  return marker;
}

// Get user's current location
export function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

// Calculate distance between two coordinates in miles
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Haversine formula
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(1));
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}
