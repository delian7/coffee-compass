import { Marker } from 'mapbox-gl';
import { Venue } from '@/types/venues';
import { createMarkerElement } from './MarkerElement';

interface VenueMarkerProps {
  venue: Venue;
  onClick: () => void;
  isSelected?: boolean;
}

export default class VenueMarker extends Marker {
  venue: Venue;
  onClick: () => void;

  constructor({ venue, onClick, isSelected = false }: VenueMarkerProps) {
    // Create the marker element
    const element = createMarkerElement({ venue, isSelected });

    // Create the marker with the venue's coordinates
    super({
      element,
      anchor: 'bottom',
      offset: [0, -5],
    });

    this.venue = venue;
    this.onClick = onClick;

    // Set the marker's position
    this.setLngLat([venue.longitude, venue.latitude]);

    // Add click event listener
    element.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(e: MouseEvent) {
    e.stopPropagation();
    this.onClick();
  }

  // Override remove to clean up event listeners
  remove() {
    if (this.getElement()) {
      this.getElement().removeEventListener('click', this.handleClick.bind(this));
    }
    return super.remove();
  }
}
