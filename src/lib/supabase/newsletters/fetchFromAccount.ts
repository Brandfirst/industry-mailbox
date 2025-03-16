
import { supabase } from "@/integrations/supabase/client";
import { Newsletter, NewsletterFilters } from "../types";

/**
 * Get newsletters from a specific email account with filtering and pagination
 * @param accountId The email account ID
 * @param page The page number for pagination
 * @param filters Optional filters to apply
 * @returns The newsletters data, error (if any), and total count
 */
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
