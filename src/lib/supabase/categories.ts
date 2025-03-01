
import { supabase } from "@/integrations/supabase/client";
import { NewsletterCategory, CategoryWithStats } from "./types";

// Get all categories
export async function getAllCategories(): Promise<NewsletterCategory[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, color, created_at")
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }

    // Ensure type safety by validating the response structure
    if (!data || !Array.isArray(data)) {
      console.error("Invalid categories data format:", data);
      return [];
    }

    return data as NewsletterCategory[];
  } catch (error) {
    console.error("Exception in getAllCategories:", error);
    return [];
  }
}

// Create a new category
export async function createCategory(categoryData: Partial<NewsletterCategory>) {
  const { data, error } = await supabase
    .from("categories")
    .insert(categoryData)
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error);
    throw error;
  }

  return data;
}

// Update an existing category
export async function updateCategory(id: number, categoryData: Partial<NewsletterCategory>) {
  const { data, error } = await supabase
    .from("categories")
    .update(categoryData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error);
    throw error;
  }

  return data;
}

// Delete a category
export async function deleteCategory(id: number) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    throw error;
  }

  return true;
}

// Get category by ID
export async function getCategoryById(id: number): Promise<NewsletterCategory | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, color, created_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data;
}

// Get statistics for a category (number of newsletters)
export async function getCategoryStats(categoryId: number): Promise<number> {
  const { count, error } = await supabase
    .from("newsletters")
    .select("id", { count: "exact" })
    .eq("category_id", categoryId);

  if (error) {
    console.error("Error getting category stats:", error);
    return 0;
  }

  return count || 0;
}

// Get all categories with newsletter counts
export async function getCategoriesWithStats(): Promise<CategoryWithStats[]> {
  // First get all categories
  const categories = await getAllCategories();
  
  // Then get counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const count = await getCategoryStats(category.id);
      return { ...category, count, newsletterCount: count };
    })
  );
  
  return categoriesWithCounts;
}
