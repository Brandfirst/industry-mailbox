
import React, { memo, useState } from 'react';
import { NewsletterCategory } from '@/lib/supabase/types';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, X } from "lucide-react";
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
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [dateOpen, setDateOpen] = useState(true);
  const [senderOpen, setSenderOpen] = useState(true);
  
  const clearAllFilters = () => {
    handleCategoryChange('all');
    setDateRange({ from: undefined, to: undefined });
    selectedBrands.forEach(brand => handleBrandChange(brand, false));
  };
  
  const hasActiveFilters = selectedCategory !== 'all' || selectedBrands.length > 0 || dateRange.from || dateRange.to;
  
  return (
    <div className="hidden md:block">
      {isOpen ? (
        <div className="w-80 p-4 border-r">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Filtre</h3>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="h-8 px-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Nullstill alle
                </Button>
              )}
            </div>
            
            <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
              <div className="flex justify-between items-center">
                <h3 className="font-medium mb-2">Kategorier</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {categoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <CategoryFilter 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  handleCategoryChange={handleCategoryChange}
                />
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible open={dateOpen} onOpenChange={setDateOpen}>
              <div className="flex justify-between items-center">
                <h3 className="font-medium mb-2">Dato</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {dateOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <DateRangePicker 
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              </CollapsibleContent>
            </Collapsible>
            
            <Collapsible open={senderOpen} onOpenChange={setSenderOpen}>
              <div className="flex justify-between items-center">
                <h3 className="font-medium mb-2">Avsender</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {senderOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <SenderFilter 
                  senderBrands={senderBrands}
                  selectedBrands={selectedBrands}
                  handleBrandChange={handleBrandChange}
                />
              </CollapsibleContent>
            </Collapsible>
            
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
