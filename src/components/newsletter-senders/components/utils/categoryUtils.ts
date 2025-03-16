
import { NewsletterCategory } from "@/lib/supabase/types";

export function getCategoryNameById(categories: NewsletterCategory[], categoryId: number | null): string {
  if (!categoryId) return "Uncategorized";
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : "Uncategorized";
}

export function getCategoryColorById(categories: NewsletterCategory[], categoryId: number | null): string {
  if (!categoryId) return "#666666";
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.color : "#666666";
}
