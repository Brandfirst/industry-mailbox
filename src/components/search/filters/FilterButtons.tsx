
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ChevronRight, ChevronLeft } from 'lucide-react';

interface FilterButtonsProps {
  toggleMobileFilters: () => void;
  toggleDesktopFilters?: () => void;
  isDesktopFiltersOpen?: boolean;
  showDesktopFilterButton?: boolean;
}

const FilterButtons = ({ 
  toggleMobileFilters,
  toggleDesktopFilters,
  isDesktopFiltersOpen,
  showDesktopFilterButton = true // Default to true for backward compatibility
}: FilterButtonsProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="md:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleMobileFilters}
          className="flex items-center gap-2 filter-button"
        >
          <Filter className="h-4 w-4" /> Filtre
        </Button>
      </div>

      {toggleDesktopFilters && showDesktopFilterButton && (
        <div className="hidden md:block">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDesktopFilters}
            className={`flex items-center gap-2 filter-button ${
              isDesktopFiltersOpen ? "bg-[#FF5722] text-white hover:bg-orange-600" : ""
            }`}
          >
            {isDesktopFiltersOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {isDesktopFiltersOpen ? "Skjul filtre" : "Vis filtre"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterButtons;
