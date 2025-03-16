
import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "../types";
import { NewsletterFilterOptions } from "./types";

/**
 * Get all newsletters with pagination and optional filtering
 * @param options Filter and pagination options
 * @returns The newsletters data, error (if any), and pagination details
 */
export async function getAllNewsletters(options: NewsletterFilterOptions = {}) {
  try {
    const {
      page = 1,
      limit = 10,
      categoryId,
      searchQuery,
      industries,
      fromDate,
      toDate
    } = options;

    const startRow = (page - 1) * limit;
    const endRow = startRow + limit - 1;

    let query = supabase
      .from('newsletters')
      .select('*, categories:category_id(*)', { count: 'exact' })
      .order('published_at', { ascending: false });

    // Apply filters
    if (categoryId && categoryId !== 'all') {
      // Convert string to number if needed before using in the query
      const categoryIdNum = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
      
      // Only apply the filter if we have a valid number
      if (!isNaN(categoryIdNum)) {
        query = query.eq('category_id', categoryIdNum);
      }
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,preview.ilike.%${searchQuery}%,sender.ilike.%${searchQuery}%`);
    }

    if (industries && industries.length > 0) {
      query = query.in('industry', industries);
    }

    if (fromDate) {
      query = query.gte('published_at', fromDate);
    }

    if (toDate) {
      query = query.lte('published_at', toDate);
    }

    const { data, error, count } = await query.range(startRow, endRow);

    if (error) {
      console.error("Error fetching all newsletters:", error);
      throw error;
    }

    return { 
      data: data as Newsletter[], 
      error: null, 
      total: count || 0,
      page,
      pages: Math.ceil((count || 0) / limit)
    };
  } catch (error) {
    console.error("Error in getAllNewsletters:", error);
    throw error;
  }
}
