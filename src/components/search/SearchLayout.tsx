
import React, { memo } from 'react';
import FilterSidebar from '@/components/search/FilterSidebar';
import { NewsletterCategory } from '@/lib/supabase/types';

interface SenderBrand {
  sender_email: string;
  sender_name: string;
  count: number;
}

interface SearchLayoutProps {
  children: React.ReactNode;
  categories: NewsletterCategory[];
  selectedCategory: string;
  handleCategoryChange: (categoryId: string) => void;
  senderBrands: SenderBrand[];
  selectedBrands: string[];
  handleBrandChange: (brand: string, checked: boolean) => void;
  dateRange: { from: Date | undefined, to: Date | undefined };
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
  onApplyFilters: () => void;
  isMobileFiltersOpen: boolean;
  toggleMobileFilters: () => void;
  isDesktopFiltersOpen: boolean;
  toggleDesktopFilters: () => void;
}

const SearchLayout = ({
  children,
  categories,
  selectedCategory,
  handleCategoryChange,
  senderBrands,
  selectedBrands,
  handleBrandChange,
  dateRange,
  setDateRange,
  onApplyFilters,
  isMobileFiltersOpen,
  toggleMobileFilters,
  isDesktopFiltersOpen,
  toggleDesktopFilters
}: SearchLayoutProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-0 mt-8">
      {isDesktopFiltersOpen && (
        <FilterSidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          senderBrands={senderBrands}
          selectedBrands={selectedBrands}
          handleBrandChange={handleBrandChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onApplyFilters={onApplyFilters}
          isMobileOpen={isMobileFiltersOpen}
          toggleMobileFilters={toggleMobileFilters}
          isDesktopOpen={isDesktopFiltersOpen}
          toggleDesktopFilters={toggleDesktopFilters}
        />
      )}
      
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default memo(SearchLayout);
