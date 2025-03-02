
import React, { memo } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { NewsletterCategory } from '@/lib/supabase/types';

interface CategoryFilterProps {
  categories: NewsletterCategory[];
  selectedCategory: string;
  handleCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  handleCategoryChange 
}: CategoryFilterProps) => {
  return (
    <RadioGroup 
      value={selectedCategory} 
      onValueChange={handleCategoryChange}
      className="space-y-1"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="all" id="category-all" />
        <Label htmlFor="category-all" className="cursor-pointer">
          Alle kategorier
        </Label>
      </div>
      
      {categories.map((category) => (
        <div key={category.id} className="flex items-center space-x-2">
          <RadioGroupItem value={String(category.id)} id={`category-${category.id}`} />
          <Label 
            htmlFor={`category-${category.id}`} 
            className="cursor-pointer flex items-center"
          >
            <span 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: category.color || '#888' }}
            />
            {category.name}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default memo(CategoryFilter);
