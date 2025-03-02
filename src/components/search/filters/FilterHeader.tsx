
import React, { memo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FilterHeaderProps {
  toggleMobileFilters: () => void;
  title?: string;
}

const FilterHeader = ({ toggleMobileFilters, title = "Sender Profile" }: FilterHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleMobileFilters} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </div>
  );
};

export default memo(FilterHeader);
