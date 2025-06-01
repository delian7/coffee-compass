import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Venue, VenueContextType, VenueFilters } from '@/types/venues';
import { useToast } from '@/hooks/use-toast';

// Create venues context
const VenueContext = createContext<VenueContextType | undefined>(undefined);

async function fetchVenues() {
  const response = await fetch('/api/venues');
  if (!response.ok) throw new Error('Failed to fetch venues');
  return response.json();
}

export function VenueProvider({ children }: { children: ReactNode }) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [filters, setFiltersState] = useState<VenueFilters>({
    type: 'all',
    search: '',
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: fetchVenues,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Apply filters
  const filteredVenues = venues.filter((venue: Venue) => {
    if (filters.type !== 'all') {
      if (filters.type === 'coffee') {
        if (venue.type !== 'coffee' && venue.type !== 'bakery') {
          return false;
        }
      } else if (venue.type !== filters.type) {
        return false;
      }
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        venue.name.toLowerCase().includes(searchLower) ||
        venue.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const setFilters = (newFilters: Partial<VenueFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refreshVenues = async () => {
    try {
      await fetch('/api/venues/refresh', { method: 'POST' });
      await queryClient.invalidateQueries({ queryKey: ['venues'] });
      toast({
        title: 'Success',
        description: 'Venues refreshed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh venues',
        variant: 'destructive',
      });
    }
  };

  return (
    <VenueContext.Provider
      value={{
        venues,
        filteredVenues,
        selectedVenue,
        filters,
        isLoading,
        setFilters,
        selectVenue: setSelectedVenue,
        refreshVenues,
      }}
    >
      {children}
    </VenueContext.Provider>
  );
}

export function useVenues() {
  const context = useContext(VenueContext);
  if (!context) {
    throw new Error('useVenues must be used within a VenueProvider');
  }
  return context;
}
