import { useVenues } from '@/hooks/use-venues';
import { VenueList } from '@/components/venues/VenueList';
import { Search } from '@/components/ui/search';
import { FilterButtonGroup } from '@/components/ui/filter-button';
import { Coffee } from 'lucide-react';

export function Sidebar() {
  const { filters, setFilters } = useVenues();
  
  const handleFilterChange = (type: 'all' | 'coffee' | 'restaurant' | 'bar') => {
    setFilters({ type });
  };
  
  return (
    <aside className="hidden md:block w-full md:w-[400px] bg-white shadow-lg overflow-y-auto z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <Coffee className="text-coffee-primary text-2xl mr-3" />
          <h1 className="font-poppins font-bold text-2xl text-coffee-primary">CoffeeMap</h1>
        </div>
        
        {/* Filters */}
        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-lg mb-3">Filters</h2>
          <FilterButtonGroup
            activeType={filters.type}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Search */}
        <Search />
      </div>
      
      {/* Venue List */}
      <VenueList />
    </aside>
  );
}
