
import React from 'react';
import { NewsletterCategory } from '@/lib/supabase/types';
import MobileFilterDrawer from './filters/MobileFilterDrawer';
import DesktopFilterSidebar from './filters/DesktopFilterSidebar';

interface SenderBrand {
  sender_email: string;
  sender_name: string;
  count: number;
}

interface FilterSidebarProps {
  categories: NewsletterCategory[];
  selectedCategory: string;
  handleCategoryChange: (categoryId: string) => void;
  senderBrands: SenderBrand[];
  selectedBrands: string[];
  handleBrandChange: (brand: string, checked: boolean) => void;
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
  onApplyFilters: () => void;
  isMobileOpen: boolean;
  toggleMobileFilters: () => void;
  isDesktopOpen: boolean;
  toggleDesktopFilters: () => void;
}

const FilterSidebar = ({
  categories,
  selectedCategory,
  handleCategoryChange,
  senderBrands,
  selectedBrands,
  handleBrandChange,
  dateRange,
  setDateRange,
  onApplyFilters,
  isMobileOpen,
  toggleMobileFilters,
  isDesktopOpen,
  toggleDesktopFilters
}: FilterSidebarProps) => {
  return (
    <>
      <DesktopFilterSidebar 
        isOpen={isDesktopOpen}
        toggleDesktopFilters={toggleDesktopFilters}
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        senderBrands={senderBrands}
        selectedBrands={selectedBrands}
        handleBrandChange={handleBrandChange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onApplyFilters={onApplyFilters}
      />
      
      <MobileFilterDrawer 
        isOpen={isMobileOpen}
        toggleMobileFilters={toggleMobileFilters}
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        senderBrands={senderBrands}
        selectedBrands={selectedBrands}
        handleBrandChange={handleBrandChange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onApplyFilters={onApplyFilters}
      />
    </>
  );
};

export default FilterSidebar;
