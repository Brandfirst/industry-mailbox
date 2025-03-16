
import React from 'react';
import SearchLayout from '@/components/search/SearchLayout';
import FilterButtons from '@/components/search/FilterButtons';
import NewsletterResults from '@/components/search/NewsletterResults';
import { Newsletter, NewsletterCategory } from '@/lib/supabase/types';

interface SenderContentProps {
  newsletters: Newsletter[];
  categories: NewsletterCategory[];
  senderBrands: any[];
  loading: boolean;
  searchQuery: string;
  selectedCategory: string;
  selectedBrands: string[];
  dateRange: { from: Date | undefined, to: Date | undefined };
  hasMore: boolean;
  isMobileFiltersOpen: boolean;
  isDesktopFiltersOpen: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  handleCategoryChange: (categoryId: string) => void;
  handleBrandChange: (brand: string, checked: boolean) => void;
  setDateRange: (range: { from: Date | undefined, to: Date | undefined }) => void;
  applyFilters: () => void;
  toggleMobileFilters: () => void;
  toggleDesktopFilters: () => void;
  handleLoadMore: () => void;
  handleNewsletterClick: (newsletter: Newsletter) => void;
}

const SenderContent = ({
  newsletters,
  categories,
  senderBrands,
  loading,
  searchQuery,
  selectedCategory,
  selectedBrands,
  dateRange,
  hasMore,
  isMobileFiltersOpen,
  isDesktopFiltersOpen,
  setSearchQuery,
  setSelectedCategory,
  handleCategoryChange,
  handleBrandChange,
  setDateRange,
  applyFilters,
  toggleMobileFilters,
  toggleDesktopFilters,
  handleLoadMore,
  handleNewsletterClick,
}: SenderContentProps) => {
  return (
    <div className="container py-2 px-4 md:px-6 flex-1">
      <SearchLayout
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        senderBrands={senderBrands}
        selectedBrands={selectedBrands}
        handleBrandChange={handleBrandChange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onApplyFilters={applyFilters}
        isMobileFiltersOpen={isMobileFiltersOpen}
        toggleMobileFilters={toggleMobileFilters}
        isDesktopFiltersOpen={isDesktopFiltersOpen}
        toggleDesktopFilters={toggleDesktopFilters}
      >
        <FilterButtons
          toggleMobileFilters={toggleMobileFilters}
          toggleDesktopFilters={toggleDesktopFilters}
          isDesktopFiltersOpen={isDesktopFiltersOpen}
          showDesktopFilterButton={false} // Hide the desktop filter button on sender pages
        />
        
        <NewsletterResults
          newsletters={newsletters}
          loading={loading}
          hasMore={hasMore}
          handleLoadMore={handleLoadMore}
          handleNewsletterClick={handleNewsletterClick}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedCategory={setSelectedCategory}
        />
      </SearchLayout>
    </div>
  );
};

export default SenderContent;
