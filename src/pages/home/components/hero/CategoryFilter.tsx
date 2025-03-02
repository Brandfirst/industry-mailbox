
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, setSelectedCategory }: CategoryFilterProps) => {
  const isMobile = useIsMobile();
  
  const categories = [
    { id: "all", name: "Alle kategorier" },
    { id: "1", name: "Business" },
    { id: "2", name: "Education" },
    { id: "3", name: "Finance" },
    { id: "4", name: "Health" }
  ];
  
  // Render dropdown on mobile, buttons on desktop
  if (isMobile) {
    return (
      <div className="w-full max-w-xs mx-auto mb-8 mt-8">
        <Select 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full bg-black/40 backdrop-blur-sm border-gray-700 text-white">
            <SelectValue placeholder="Velg kategori" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 backdrop-blur-sm border-gray-700 text-white">
            {categories.map(category => (
              <SelectItem 
                key={category.id} 
                value={category.id}
                className="hover:bg-[#FF5722]/10 focus:bg-[#FF5722]/10"
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
      {categories.map(category => (
        <Button 
          key={category.id}
          variant="outline" 
          className={`bg-black/40 backdrop-blur-sm rounded-lg ${
            selectedCategory === category.id 
              ? "text-white border-[#FF5722] border-2" 
              : "text-gray-300 border-gray-700"
          } hover:bg-[#FF5722]/10`}
          onClick={() => setSelectedCategory(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
