
import { Newsletter, NewsletterCategory, updateNewsletterCategory } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type CategorySelectorProps = {
  newsletter: Newsletter;
  categories: NewsletterCategory[];
  onCategoryChange: (updatedNewsletter: Newsletter) => void;
};

export function CategorySelector({ newsletter, categories, onCategoryChange }: CategorySelectorProps) {
  const handleCategoryChange = async (categoryId: string) => {
    try {
      // Convert categoryId to number or null if empty string
      const numericCategoryId = categoryId ? parseInt(categoryId) : null;
      
      await updateNewsletterCategory(newsletter.id, numericCategoryId);
      toast.success("Category updated successfully");
      
      // Update the local state to reflect the change
      const updatedNewsletter = { 
        ...newsletter, 
        category_id: numericCategoryId 
      };
      
      onCategoryChange(updatedNewsletter);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  return (
    <Select
      value={newsletter.category_id?.toString() || "uncategorized"}
      onValueChange={handleCategoryChange}
    >
      <SelectTrigger className="w-full max-w-[180px]">
        <SelectValue placeholder="Categorize" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="uncategorized">Uncategorized</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id.toString()}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
