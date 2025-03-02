
import React, { memo } from 'react';
import { NewsletterCategory } from '@/lib/supabase/types';
import { Button } from "@/components/ui/button";
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import DateRangePicker from './DateRangePicker';
import CategoryFilter from './CategoryFilter';
import SenderFilter from './SenderFilter';

interface SenderBrand {
  sender_email: string;
  sender_name: string;
  count: number;
}

interface DesktopFilterSidebarProps {
  isOpen: boolean;
  toggleDesktopFilters: () => void;
  categories: NewsletterCategory[];
  selectedCategory: string;
  handleCategoryChange: (categoryId: string) => void;
  senderBrands: SenderBrand[];
  selectedBrands: string[];
  handleBrandChange: (brand: string, checked: boolean) => void;
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
  onApplyFilters: () => void;
}

const DesktopFilterSidebar = ({
  isOpen,
  toggleDesktopFilters,
  categories,
  selectedCategory,
  handleCategoryChange,
  senderBrands,
  selectedBrands,
  handleBrandChange,
  dateRange,
  setDateRange,
  onApplyFilters
}: DesktopFilterSidebarProps) => {
  return (
    <div className="hidden md:block">
      <Collapsible
        open={isOpen}
        onOpenChange={toggleDesktopFilters}
        className="border-r"
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-medium">Filtre</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {!isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="w-64 p-4 space-y-6">
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
          />
          <SenderFilter 
            senderBrands={senderBrands}
            selectedBrands={selectedBrands}
            handleBrandChange={handleBrandChange}
          />
          
          <Button 
            className="w-full mt-4" 
            onClick={onApplyFilters}
          >
            Bruk filtre
          </Button>
        </CollapsibleContent>
      </Collapsible>
      
      {!isOpen && (
        <div className="w-12 flex flex-col items-center py-4 border-r">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDesktopFilters}
            className="mb-2"
            title="Åpne filter"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(DesktopFilterSidebar);
