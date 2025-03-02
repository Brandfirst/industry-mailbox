
import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "../types";
import { NewsletterFilterOptions, NewsletterQueryResult } from "./types";

/**
 * Fetches featured newsletters with filtering capabilities.
 */
export async function getFeaturedNewsletters(
  options: NewsletterFilterOptions = {}
): Promise<NewsletterQueryResult> {
  const { searchQuery, categoryId, limit = 3 } = options;
  
  try {
    let query = supabase
      .from("newsletters")
      .select("*, categories(name, color)", { count: "exact" })
      .order("published_at", { ascending: false })
      .limit(limit);

    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }

    if (categoryId && categoryId !== "all") {
      const categoryIdNum = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId;
      query = query.eq("category_id", categoryIdNum);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching featured newsletters:", error);
      throw error;
    }

    return { data: data || [], count };
  } catch (error) {
    console.error("Exception in getFeaturedNewsletters:", error);
    return { data: [], count: 0 };
  }
}

/**
 * Fetches newsletters for search page with pagination and filtering.
 */
export async function searchNewsletters(
  options: NewsletterFilterOptions = {}
): Promise<NewsletterQueryResult> {
  const { 
    searchQuery, 
    categoryId, 
    sender,
    fromDate,
    toDate,
    page = 1, 
    limit = 12 
  } = options;
  
  try {
    const startIndex = (page - 1) * limit;
    
    let query = supabase
      .from("newsletters")
      .select("*, categories(name, color)", { count: "exact" })
      .order("published_at", { ascending: false });

    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }

    if (categoryId && categoryId !== "all") {
      const categoryIdNum = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId;
      query = query.eq("category_id", categoryIdNum);
    }
    
    // Handle sender email filtering (can be an array of emails)
    if (sender && Array.isArray(sender) && sender.length > 0) {
      query = query.in("sender_email", sender);
    } else if (sender && !Array.isArray(sender)) {
      query = query.ilike("sender_email", `%${sender}%`);
    }
    
    // Handle date range filtering
    if (fromDate) {
      query = query.gte("published_at", fromDate);
    }
    
    if (toDate) {
      query = query.lte("published_at", toDate);
    }

    // Apply pagination
    query = query.range(startIndex, startIndex + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error searching newsletters:", error);
      throw error;
    }

    return { data: data || [], count };
  } catch (error) {
    console.error("Exception in searchNewsletters:", error);
    return { data: [], count: 0 };
  }
}
