
import { Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewsletterCategory } from "@/lib/supabase/types";

type CategorySelectorProps = {
  senderEmail: string;
  categories: NewsletterCategory[];
  currentCategoryId: number | null;
  isUpdating: boolean;
  onChange: (senderEmail: string, categoryId: string) => Promise<void>;
};

const CategorySelector = ({
  senderEmail,
  categories,
  currentCategoryId,
  isUpdating,
  onChange
}: CategorySelectorProps) => {
  // Get category color for the icon
  const getCategoryColor = (categoryId: number | null) => {
    if (!categoryId || !categories) return "#E5E7EB"; // Default gray color
    const category = categories.find(c => c.id === categoryId);
    return category?.color || "#E5E7EB";
  };

  return (
    <div className="flex items-center">
      <Tag 
        className="h-4 w-4 mr-2" 
        style={{ color: getCategoryColor(currentCategoryId) }} 
      />
      <Select
        value={currentCategoryId?.toString() || "null"}
        onValueChange={(value) => onChange(senderEmail, value)}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[180px] bg-background border-border">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border text-foreground shadow-md">
          <SelectItem value="null" className="text-foreground">Uncategorized</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()} className="text-foreground">
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
