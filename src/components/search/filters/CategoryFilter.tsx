
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
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
  );
};

export default CategoryFilter;
