
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NewsletterCategory } from '@/lib/supabase/types';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Format date for display
  const formatDateRange = () => {
    if (!dateRange.from && !dateRange.to) return '';
    
    const formatDate = (date: Date | undefined) => {
      if (!date) return '';
      return date.toISOString().split('T')[0];
    };
    
    return `${formatDate(dateRange.from)} — ${formatDate(dateRange.to)}`;
  };

  // Clear date range
  const handleClearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
    setIsDatePickerOpen(false);
  };

  const filterContent = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          <h3 className="text-lg font-semibold">Filtre</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMobileFilters}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Date Range Section */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Dato</h4>
        <div className="border rounded-md">
          <div className="flex">
            <Button
              type="button"
              variant="ghost"
              className={`flex-1 rounded-md ${!isDatePickerOpen ? 'bg-muted' : ''}`}
              onClick={() => setIsDatePickerOpen(true)}
            >
              Datoområde
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="Velg datoer"
            className="w-full cursor-pointer"
            value={formatDateRange()}
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            readOnly
          />
          
          {dateRange.from || dateRange.to ? (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={handleClearDateRange}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
          
          {isDatePickerOpen && (
            <div className="absolute z-50 mt-2 bg-popover border rounded-md shadow-md">
              <div className="p-2 bg-muted/30 border-b flex items-center justify-between">
                <span className="text-sm font-medium">
                  {dateRange.from && dateRange.to 
                    ? 'Valgt periode' 
                    : dateRange.from 
                      ? 'Velg sluttdato' 
                      : 'Velg startdato'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearDateRange}
                >
                  Nullstill
                </Button>
              </div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{
                  from: dateRange.from,
                  to: dateRange.to
                }}
                onSelect={(range) => {
                  setDateRange({
                    from: range?.from,
                    to: range?.to
                  });
                  if (range?.to) setIsDatePickerOpen(false);
                }}
                className="rounded-md"
              />
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">
          30 dagers søkegrense. Oppgrader for å søke lenger tilbake.
        </p>
      </div>
      
      {/* Categories Section */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Kategorier</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all-categories" 
              checked={selectedCategory === 'all'} 
              onCheckedChange={() => handleCategoryChange('all')}
            />
            <Label htmlFor="all-categories" className="cursor-pointer">
              Alle kategorier
            </Label>
            <span className="text-sm text-muted-foreground ml-auto">
              {categories.length}
            </span>
          </div>
          
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category.id}`} 
                checked={selectedCategory === String(category.id)} 
                onCheckedChange={() => handleCategoryChange(String(category.id))}
              />
              <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Brands Section */}
      {senderBrands.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Avsendere</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {senderBrands.map((brand) => (
              <div key={brand.sender_email} className="flex items-center space-x-2">
                <Checkbox 
                  id={`brand-${brand.sender_email}`} 
                  checked={selectedBrands.includes(brand.sender_email)} 
                  onCheckedChange={(checked) => handleBrandChange(brand.sender_email, !!checked)}
                />
                <Label htmlFor={`brand-${brand.sender_email}`} className="cursor-pointer">
                  {brand.sender_name || brand.sender_email}
                </Label>
                <span className="text-sm text-muted-foreground ml-auto">
                  {brand.count || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button 
        className="w-full mt-4" 
        onClick={() => {
          onApplyFilters();
          if (window.innerWidth < 768) {
            toggleMobileFilters();
          }
        }}
      >
        Bruk filtre
      </Button>
    </>
  );

  // Mobile sidebar (slide in from right)
  const mobileSidebar = isMobileOpen ? (
    <div className="md:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={toggleMobileFilters}
      ></div>
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-3/4 max-w-xs bg-background p-4 overflow-y-auto animate-slide-in-right">
        {filterContent}
      </div>
    </div>
  ) : null;

  // Desktop sidebar with collapsible functionality
  const desktopSidebar = (
    <div className="hidden md:block">
      <Collapsible
        open={isDesktopOpen}
        onOpenChange={toggleDesktopFilters}
        className="border-r"
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="font-medium">Filtre</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {!isDesktopOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="w-64 p-4 space-y-6">
          {filterContent}
        </CollapsibleContent>
      </Collapsible>
      
      {!isDesktopOpen && (
        <div className="w-12 flex flex-col items-center py-4 border-r">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDesktopFilters}
            className="mb-2"
            title="Åpne filter"
          >
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
};

export default FilterSidebar;
