
import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { NewsletterCategory } from '@/lib/supabase/types';
import FilterHeader from './FilterHeader';
import CategoryFilter from './CategoryFilter';
import DateRangePicker from './DateRangePicker';
import SenderFilter from './SenderFilter';

interface SenderBrand {
  sender_email: string;
  sender_name: string;
  count: number;
}

interface MobileFilterDrawerProps {
  isOpen: boolean;
  toggleMobileFilters: () => void;
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

const MobileFilterDrawer = ({
  isOpen,
  toggleMobileFilters,
  categories,
  selectedCategory,
  handleCategoryChange,
  senderBrands,
  selectedBrands,
  handleBrandChange,
  dateRange,
  setDateRange,
  onApplyFilters
}: MobileFilterDrawerProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={toggleMobileFilters}
      ></div>
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-background p-4 overflow-y-auto animate-slide-in-right">
        <FilterHeader toggleMobileFilters={toggleMobileFilters} title="Filtre" />
        
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
            onClick={() => {
              onApplyFilters();
              toggleMobileFilters();
            }} 
            className="w-full"
          >
            Bruk filtre
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(MobileFilterDrawer);
