
import { supabase } from "@/integrations/supabase/client";
import { Newsletter, NewsletterFilters } from "../types";
import { NewsletterFilterOptions } from "./types";

// Get a single newsletter by ID
export async function getNewsletterById(id: string | number) {
  // Convert string ID to number if it's a string
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  return supabase
    .from('newsletters')
    .select('*, categories:category_id(*)')
    .eq('id', numericId)
    .single();
}

// Get newsletters from a specific email account
export async function getNewslettersFromEmailAccount(
  accountId: string, 
  page: number = 1, 
  filters: NewsletterFilters = {}
) {
  try {
    if (!accountId) {
      console.error("No account ID provided for fetching newsletters");
      return { data: [], error: new Error("No account ID provided"), total: 0 };
    }

    console.log(`Fetching newsletters for account ${accountId}, page ${page}`, { filters });
    
    // First, get the email address for the account
    const { data: account, error: accountError } = await supabase
      .from('email_accounts')
      .select('email')
      .eq('id', accountId)
      .single();
    
    if (accountError) {
      console.error(`Error fetching account ${accountId}:`, accountError);
      return { data: [], error: accountError, total: 0 };
    }
    
    if (!account) {
      console.error(`Account ${accountId} not found`);
      return { data: [], error: new Error("Account not found"), total: 0 };
    }
    
    // Define page size and calculate range
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    // Build base query - use email_id to get emails imported for this account
    let query = supabase
      .from('newsletters')
      .select('*, categories:category_id(*)', { count: 'exact' })
      .eq('email_id', accountId)
      .order('published_at', { ascending: false });
    
    // Apply filters
    if (filters.category && filters.category !== 'all') {
      const categoryIdNum = typeof filters.category === 'string' 
        ? parseInt(filters.category, 10) 
        : filters.category;
        
      query = query.eq('category_id', categoryIdNum);
    }
    
    if (filters.fromDate) {
      query = query.gte('published_at', filters.fromDate);
    }
    
    if (filters.toDate) {
      query = query.lte('published_at', filters.toDate);
    }
    
    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,preview.ilike.%${filters.searchQuery}%,sender.ilike.%${filters.searchQuery}%`);
    }
    
    if (filters.sender) {
      query = query.eq('sender', filters.sender);
    }
    
    // Execute the query with pagination
    const { data, error, count } = await query.range(start, end);
    
    if (error) {
      console.error("Error fetching newsletters:", error);
      return { data: [], error, total: 0 };
    }
    
    console.log(`Retrieved ${data?.length || 0} newsletters for account ${accountId}`);
    
    return { 
      data: data as Newsletter[], 
      error: null, 
      total: count || 0
    };
  } catch (error) {
    console.error("Error in getNewslettersFromEmailAccount:", error);
    return { 
      data: [], 
      error: error instanceof Error ? error : new Error(String(error)), 
      total: 0 
    };
  }
}

// Get all newsletters with pagination and optional filtering
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
