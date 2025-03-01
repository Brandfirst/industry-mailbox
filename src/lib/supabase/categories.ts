
import { supabase } from "@/integrations/supabase/client";
import { NewsletterCategory } from "./types";

// Category functions
export async function getAllCategories(): Promise<NewsletterCategory[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, color, created_at");

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
export async function createCategory(categoryData) {
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
