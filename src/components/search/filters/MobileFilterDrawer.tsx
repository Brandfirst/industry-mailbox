
import React from 'react';
import { Button } from "@/components/ui/button";
import { NewsletterCategory } from '@/lib/supabase/types';
import FilterHeader from './FilterHeader';
import DateRangePicker from './DateRangePicker';
import CategoryFilter from './CategoryFilter';
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
        <FilterHeader toggleMobileFilters={toggleMobileFilters} />
        
        <div className="space-y-6">
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
        </div>

        <Button 
          className="w-full mt-6" 
          onClick={() => {
            onApplyFilters();
            toggleMobileFilters();
          }}
        >
          Bruk filtre
        </Button>
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
