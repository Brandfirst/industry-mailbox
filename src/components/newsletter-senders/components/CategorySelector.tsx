
import { Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewsletterCategory } from "@/lib/supabase/types";

type CategorySelectorProps = {
  senderEmail: string;
  categoryId: number | null;
  categories: NewsletterCategory[];
  isUpdating: boolean;
  onCategoryChange: (senderEmail: string, categoryId: string) => Promise<void>;
  getCategoryNameById: (categoryId: number | null) => string;
  getCategoryColorById: (categoryId: number | null) => string;
};

const CategorySelector = ({
  senderEmail,
  categoryId,
  categories,
  isUpdating,
  onCategoryChange,
  getCategoryNameById,
  getCategoryColorById
}: CategorySelectorProps) => {
  return (
    <div className="flex items-center">
      <Tag 
        className="h-4 w-4 mr-2" 
        style={{ color: getCategoryColorById(categoryId) }} 
      />
      <Select
        value={categoryId?.toString() || "null"}
        onValueChange={(value) => onCategoryChange(senderEmail, value)}
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
