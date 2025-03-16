
import { NewsletterCategory } from "@/lib/supabase/types";

// Get category name by ID
export const getCategoryNameById = (
  categoryId: number | null,
  categories: NewsletterCategory[]
): string => {
  if (!categoryId || !categories) return "Not categorized";
  
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : "Not categorized";
};

// Get category color by ID
export const getCategoryColorById = (
  categoryId: number | null,
  categories: NewsletterCategory[]
): string => {
  if (!categoryId || !categories) return "#E5E7EB"; // Default gray color
  
  const category = categories.find(c => c.id === categoryId);
  return category?.color || "#E5E7EB";
};

export const DEFAULT_CATEGORY_COLOR = "#E5E7EB";
