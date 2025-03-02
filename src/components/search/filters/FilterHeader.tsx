
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FilterHeaderProps {
  toggleMobileFilters: () => void;
}

const FilterHeader = ({ toggleMobileFilters }: FilterHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Filter className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-semibold">Filtre</h3>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMobileFilters}
        className="md:hidden"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default FilterHeader;
