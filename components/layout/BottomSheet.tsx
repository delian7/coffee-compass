import { useState, useEffect, useRef } from 'react';
import { VenueList } from '@/components/venues/VenueList';
import { Search } from '@/components/ui/search';
import { FilterButtonGroup } from '@/components/ui/filter-button';
import { useVenues } from '@/hooks/use-venues';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function BottomSheet({ isOpen, onToggle }: BottomSheetProps) {
  const { filters, setFilters } = useVenues();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Add explicit close handler
  const handleClose = () => {
    if (isOpen) {
      onToggle();
    }
  };

  // Handle filter change
  const handleFilterChange = (type: 'all' | 'coffee' | 'restaurant' | 'bar') => {
    setFilters({ type });
  };

  // Close when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sheetRef.current &&
        !sheetRef.current.contains(event.target as Node)
      ) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div
      ref={sheetRef}
      className={cn(
        "bottom-sheet md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-transform z-20 h-[85vh]",
        isOpen ? "transform-none" : "transform translate-y-[calc(100%-70px)]"
      )}
    >
      <div className="p-4 border-b border-gray-200">
        {isOpen && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700"
            aria-label="Close sheet"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Mobile Filters */}
        <div className="mb-4 overflow-x-auto hide-scrollbar">
          <FilterButtonGroup
            activeType={filters.type}
            onFilterChange={handleFilterChange}
            className="flex-nowrap overflow-x-auto pb-2 -mx-1"
          />
        </div>

        {/* Mobile Search */}
        <Search />
      </div>

      {/* Mobile Venue List */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
        <VenueList />
      </div>
    </div>
  );
}
