export interface Venue {
  id: number;
  name: string;
  neighborhood?: string;
  recommender?: string;
  experienceLevel?: string;
  type: VenueType;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  reviewCount?: number;
  priceLevel?: string;
  openingHours?: string;
  phoneNumber?: string;
  website?: string;
  imageUrl?: string;
  tags?: string[];
  distance?: number;
}

export type VenueType = 'coffee' | 'restaurant' | 'bar';

export interface VenueFilters {
  type: VenueType | 'all';
  search: string;
}

export interface VenueContextType {
  venues: Venue[];
  filteredVenues: Venue[];
  selectedVenue: Venue | null;
  filters: VenueFilters;
  isLoading: boolean;
  setFilters: (filters: Partial<VenueFilters>) => void;
  selectVenue: (venue: Venue | null) => void;
  refreshVenues: () => void;
}
