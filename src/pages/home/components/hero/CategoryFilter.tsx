
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, setSelectedCategory }: CategoryFilterProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const categories = [
    { id: "all", name: "Alle kategorier" },
    { id: "1", name: "Business" },
    { id: "2", name: "Education" },
    { id: "3", name: "Finance" },
    { id: "4", name: "Health" }
  ];
  
  if (isMobile) {
    return (
      <div className="flex justify-center mb-8 mt-8">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px] bg-black/40 backdrop-blur-sm rounded-lg border-gray-700 text-white relative overflow-hidden announcement-glow-container">
            <div className="absolute inset-0 announcement-glow-effect"></div>
            <SelectValue placeholder="Velg kategori" className="relative z-10" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 backdrop-blur-sm border-gray-700 text-white">
            {categories.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id}
                className={`${selectedCategory === category.id ? "text-[#FF5722]" : "text-gray-300"}`}
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
      {categories.map((category) => (
        <Button 
          key={category.id}
          variant="outline" 
          className={`relative overflow-hidden announcement-glow-container ${
            selectedCategory === category.id 
              ? "text-white border-[#FF5722] border-2" 
              : "text-gray-300 border-gray-700"
          }`}
          onClick={() => setSelectedCategory(category.id)}
        >
          <div className="absolute inset-0 announcement-glow-effect"></div>
          <span className="relative z-10">{category.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
