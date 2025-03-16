
import { Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewsletterCategory } from "@/lib/supabase/types";
import { useEffect, useState } from "react";

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
  // Local state to track the current value
  const [currentValue, setCurrentValue] = useState<string>(currentCategoryId?.toString() || "null");

  // Update local state when prop changes
  useEffect(() => {
    setCurrentValue(currentCategoryId?.toString() || "null");
    console.log(`CategorySelector: Updated for ${senderEmail}, category_id: ${currentCategoryId}`);
  }, [currentCategoryId, senderEmail]);

  // Get category color for the icon
  const getCategoryColor = (categoryId: number | null) => {
    if (!categoryId || !categories) return "#E5E7EB"; // Default gray color
    const category = categories.find(c => c.id === categoryId);
    return category?.color || "#E5E7EB";
  };

  // Get category name for debugging
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find(c => c.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const handleChange = async (value: string) => {
    console.log(`CategorySelector: Value changed from ${currentValue} (${getCategoryName(currentValue === "null" ? null : parseInt(currentValue))}) to ${value} (${getCategoryName(value === "null" ? null : parseInt(value))}) for ${senderEmail}`);
    setCurrentValue(value); // Update local state immediately
    await onChange(senderEmail, value);
  };

  return (
    <div className="flex items-center">
      <Tag 
        className="h-4 w-4 mr-2" 
        style={{ color: getCategoryColor(currentCategoryId) }} 
      />
      <Select
        value={currentValue}
        onValueChange={handleChange}
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
