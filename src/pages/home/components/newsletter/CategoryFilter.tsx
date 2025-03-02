
import { Button } from "@/components/ui/button";
import { NewsletterCategory } from '@/lib/supabase/types';

interface CategoryFilterProps {
  categories: NewsletterCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        className={`${selectedCategory === 'all' ? 'bg-[#3a6ffb] text-white' : 'bg-black text-gray-300 border-gray-700 hover:bg-[#3a6ffb]/10'}`}
        onClick={() => onCategoryChange('all')}
      >
        Alle kategorier
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className={`${selectedCategory === String(category.id) ? 'bg-[#3a6ffb] text-white' : 'bg-black text-gray-300 border-gray-700 hover:bg-[#3a6ffb]/10'}`}
          onClick={() => onCategoryChange(String(category.id))}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
