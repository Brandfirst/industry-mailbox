
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
        className={`${selectedCategory === 'all' 
          ? 'bg-black text-white border-[#FF5722] hover:bg-black/90' 
          : 'bg-black/40 text-gray-300 border-gray-700 hover:bg-[#FF5722]/10 backdrop-blur-sm'
        } rounded-lg`}
        onClick={() => onCategoryChange('all')}
      >
        Alle kategorier
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          className={`${selectedCategory === String(category.id) 
            ? 'bg-black text-white border-[#FF5722] hover:bg-black/90' 
            : 'bg-black/40 text-gray-300 border-gray-700 hover:bg-[#FF5722]/10 backdrop-blur-sm'
          } rounded-lg`}
          onClick={() => onCategoryChange(String(category.id))}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
