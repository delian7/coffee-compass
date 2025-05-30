import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { useVenues } from '@/hooks/use-venues';

interface SearchProps {
  className?: string;
  placeholder?: string;
}

export function Search({ className, placeholder = "Search venues..." }: SearchProps) {
  const { filters, setFilters } = useVenues();
  const [value, setValue] = useState(filters.search);
  
  // Update search input when filters change (e.g., when reset)
  useEffect(() => {
    setValue(filters.search);
  }, [filters.search]);
  
  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Debounce search to avoid too many re-renders
    const timeoutId = setTimeout(() => {
      setFilters({ search: newValue });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-primary focus:border-coffee-primary"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
