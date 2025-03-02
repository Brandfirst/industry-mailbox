
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NewsletterCategory } from '@/lib/supabase/types';
import { Filter } from 'lucide-react';

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
  onApplyFilters
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

  return (
    <div className="w-full md:w-64 space-y-6 pr-4 border-r">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 mr-2" />
        <h3 className="text-lg font-semibold">Filtre</h3>
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
          
          {isDatePickerOpen && (
            <div className="absolute z-50 mt-2 bg-popover border rounded-md shadow-md">
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
        onClick={onApplyFilters}
      >
        Bruk filtre
      </Button>
    </div>
  );
};

export default FilterSidebar;
