
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
          <SelectTrigger className="w-[200px] bg-black/40 backdrop-blur-sm rounded-lg border-gray-700 text-white">
            <SelectValue placeholder="Velg kategori" />
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
      <Button 
        variant="outline" 
        className={`bg-black/40 backdrop-blur-sm rounded-lg ${
          selectedCategory === "all" 
            ? "text-white border-[#FF5722] border-2" 
            : "text-gray-300 border-gray-700"
        } hover:bg-[#FF5722]/10`}
        onClick={() => setSelectedCategory("all")}
      >
        Alle kategorier
      </Button>
      
      <Button 
        variant="outline" 
        className={`bg-black/40 backdrop-blur-sm rounded-lg ${
          selectedCategory === "1" 
            ? "text-white border-[#FF5722] border-2" 
            : "text-gray-300 border-gray-700"
        } hover:bg-[#FF5722]/10`}
        onClick={() => setSelectedCategory("1")}
      >
        Business
      </Button>
      
      <Button 
        variant="outline" 
        className={`bg-black/40 backdrop-blur-sm rounded-lg ${
          selectedCategory === "2" 
            ? "text-white border-[#FF5722] border-2" 
            : "text-gray-300 border-gray-700"
        } hover:bg-[#FF5722]/10`}
        onClick={() => setSelectedCategory("2")}
      >
        Education
      </Button>
      
      <Button 
        variant="outline" 
        className={`bg-black/40 backdrop-blur-sm rounded-lg ${
          selectedCategory === "3" 
            ? "text-white border-[#FF5722] border-2" 
            : "text-gray-300 border-gray-700"
        } hover:bg-[#FF5722]/10`}
        onClick={() => setSelectedCategory("3")}
      >
        Finance
      </Button>
      
      <Button 
        variant="outline" 
        className={`bg-black/40 backdrop-blur-sm rounded-lg ${
          selectedCategory === "4" 
            ? "text-white border-[#FF5722] border-2" 
            : "text-gray-300 border-gray-700"
        } hover:bg-[#FF5722]/10`}
        onClick={() => setSelectedCategory("4")}
      >
        Health
      </Button>
    </div>
  );
};

export default CategoryFilter;
