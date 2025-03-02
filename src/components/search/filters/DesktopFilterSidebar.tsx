import React, { memo } from 'react';
import { NewsletterCategory } from '@/lib/supabase/types';
import { Button } from "@/components/ui/button";
import CategoryFilter from './CategoryFilter';
import DateRangePicker from './DateRangePicker';
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
      {isOpen ? (
        <div className="w-80 p-4 border-r">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Kategorier</h3>
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                handleCategoryChange={handleCategoryChange}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Dato</h3>
              <DateRangePicker 
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Avsender</h3>
              <SenderFilter 
                senderBrands={senderBrands}
                selectedBrands={selectedBrands}
                handleBrandChange={handleBrandChange}
              />
            </div>
            
            <Button 
              onClick={onApplyFilters} 
              className="w-full"
            >
              Bruk filtre
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-12 flex flex-col items-center py-4 border-r">
          {/* We'll keep this minimal when collapsed */}
        </div>
      )}
    </div>
  );
};

export default memo(DesktopFilterSidebar);
