
import React, { memo, useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Søk kategorier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 rounded-lg"
        />
      </div>
      
      <RadioGroup 
        value={selectedCategory} 
        onValueChange={handleCategoryChange}
        className="space-y-1 max-h-[200px] overflow-y-auto"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="all" 
            id="category-all" 
            className="text-[#FF5722] border-[#FF5722] focus:ring-[#FF5722]" 
          />
          <Label htmlFor="category-all" className="cursor-pointer">
            Alle kategorier
          </Label>
        </div>
        
        {filteredCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ingen kategorier funnet</p>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={String(category.id)} 
                id={`category-${category.id}`} 
                className="text-[#FF5722] border-[#FF5722] focus:ring-[#FF5722]"
              />
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
          ))
        )}
      </RadioGroup>
    </div>
  );
};

export default memo(CategoryFilter);
