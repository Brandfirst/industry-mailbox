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
  brand_name?: string;
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
      <div className="w-64 p-4 border-r bg-gray-50 shadow-sm rounded-lg mr-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Filtre</h3>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="h-8 px-2 text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Nullstill alle
              </Button>
            )}
          </div>
          
          <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
            <div className="flex justify-between items-center">
              <h3 className="font-medium mb-2 text-gray-800">Kategorier</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-700">
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
              <h3 className="font-medium mb-2 text-gray-800">Dato</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-700">
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
              <h3 className="font-medium mb-2 text-gray-800">Avsender</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-700">
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
            className="w-full bg-[#FF5722] hover:bg-orange-600 text-white"
          >
            Bruk filtre
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(DesktopFilterSidebar);
