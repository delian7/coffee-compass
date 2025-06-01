import { getMarkerIcon, getVenueTypeColor } from '@/lib/utils';
import { Venue } from '@/types/venues';

interface MarkerElementProps {
  venue: Venue;
  isSelected?: boolean;
}

export function createMarkerElement({ venue, isSelected = false }: MarkerElementProps): HTMLElement {
  // Create container element
  const element = document.createElement('div');
  element.className = 'marker-container cursor-pointer transform transition-transform duration-200 hover:scale-110';

  // Create marker element with dynamic color based on venue type
  const marker = document.createElement('div');
  // Add specific styles to ensure background color is visible
  marker.className = `w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ${
    isSelected ? 'scale-125 ring-2 ring-white' : ''
  }`;
  marker.style.backgroundColor = getBackgroundColor(venue.type);

  // Create icon wrapper to control icon size
  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'w-5 h-5';
  iconWrapper.innerHTML = getMarkerIcon(venue.type);

  // Add icon wrapper to marker
  marker.appendChild(iconWrapper);

  // Add marker to container
  element.appendChild(marker);

  return element;
}

// Helper function to get the actual color values
function getBackgroundColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'coffee':
      return '#6F4E37'; // coffee brown
    case 'restaurant':
      return '#EF4444'; // red-500
    case 'bar':
      return '#4F46E5'; // indigo-600
    case 'bakery':
      return '#8B5FBF'; // purple-500
    default:
      return '#6B7280'; // gray-500
  }
}