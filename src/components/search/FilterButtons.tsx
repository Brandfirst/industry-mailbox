import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface FilterButtonsProps {
  toggleMobileFilters: () => void;
  toggleDesktopFilters: () => void;
  isDesktopFiltersOpen: boolean;
}

const FilterButtons = ({ 
  toggleMobileFilters, 
  toggleDesktopFilters, 
  isDesktopFiltersOpen 
}: FilterButtonsProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="md:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleMobileFilters}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" /> Filtre
        </Button>
      </div>
    </div>
  );
};

export default FilterButtons;
