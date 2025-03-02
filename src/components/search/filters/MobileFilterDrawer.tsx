
import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { NewsletterCategory } from '@/lib/supabase/types';
import FilterHeader from './FilterHeader';
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
  senderBrands,
  selectedBrands,
  handleBrandChange
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
        
        <SenderFilter 
          senderBrands={senderBrands}
          selectedBrands={selectedBrands}
          handleBrandChange={handleBrandChange}
        />
      </div>
    </div>
  );
};

export default memo(MobileFilterDrawer);
