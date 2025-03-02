
import React, { memo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { NewsletterCategory } from '@/lib/supabase/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, X } from "lucide-react";
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
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [dateOpen, setDateOpen] = useState(true);
  const [senderOpen, setSenderOpen] = useState(true);
  
  const clearAllFilters = () => {
    handleCategoryChange('all');
    setDateRange({ from: undefined, to: undefined });
    selectedBrands.forEach(brand => handleBrandChange(brand, false));
  };
  
  const hasActiveFilters = selectedCategory !== 'all' || selectedBrands.length > 0 || dateRange.from || dateRange.to;
  
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
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="h-8 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Nullstill alle filtre
            </Button>
          )}
          
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
