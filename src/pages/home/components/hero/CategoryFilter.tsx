
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { NewsletterCategory } from "@/lib/supabase/types";
import { getAllCategories } from "@/lib/supabase/categories";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, setSelectedCategory }: CategoryFilterProps) => {
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  if (isMobile) {
    return (
      <div className="flex justify-center mb-8 mt-8">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px] bg-black/40 backdrop-blur-sm rounded-lg border-gray-700 text-white relative overflow-hidden announcement-glow-container">
            <div className="absolute inset-0 announcement-glow-effect"></div>
            <SelectValue placeholder="Velg kategori" className="relative z-10" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 backdrop-blur-sm border-gray-700 text-white">
            <SelectItem value="all" className={`${selectedCategory === "all" ? "text-[#FF5722]" : "text-gray-300"}`}>
              Alle kategorier
            </SelectItem>
            {!loading && categories.map((category) => (
              <SelectItem 
                key={category.id} 
                value={String(category.id)}
                className={`${selectedCategory === String(category.id) ? "text-[#FF5722]" : "text-gray-300"}`}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8 mt-16">
      <Button 
        variant="outline" 
        className={`relative overflow-hidden announcement-glow-container ${
          selectedCategory === "all" 
            ? "text-white border-[#FF5722] border-2" 
            : "text-gray-300 border-gray-700"
        }`}
        onClick={() => setSelectedCategory("all")}
      >
        <div className="absolute inset-0 announcement-glow-effect"></div>
        <span className="relative z-10">Alle kategorier</span>
      </Button>
      
      {!loading && categories.map((category) => (
        <Button 
          key={category.id}
          variant="outline" 
          className={`relative overflow-hidden announcement-glow-container ${
            selectedCategory === String(category.id) 
              ? "text-white border-[#FF5722] border-2" 
              : "text-gray-300 border-gray-700"
          }`}
          onClick={() => setSelectedCategory(String(category.id))}
        >
          <div className="absolute inset-0 announcement-glow-effect"></div>
          <span className="relative z-10">{category.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
