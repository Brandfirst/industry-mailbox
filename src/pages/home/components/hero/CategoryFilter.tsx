
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, setSelectedCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        variant="outline" 
        className={`bg-black/40 backdrop-blur-sm rounded-lg ${
          selectedCategory === "all" 
            ? "text-white border-[#FF5722] border-2" 
            : "text-gray-300 border-gray-700"
        } hover:bg-[#FF5722]/10`}
        onClick={() => setSelectedCategory("all")}
      >
        All categories
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
