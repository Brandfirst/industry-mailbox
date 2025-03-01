import { supabase } from "@/integrations/supabase/client";
import { Newsletter, NewsletterFilters } from "../types";
import { NewsletterSenderStats } from "./types";

const ITEMS_PER_PAGE = 10;

/**
 * Fetches newsletters with pagination and filtering.
 */
export async function getNewslettersFromEmailAccount(
  accountId: string | null,
  page: number,
  filters: NewsletterFilters
): Promise<{ data: Newsletter[]; error: any; total: number }> {
  if (!accountId) {
    return { data: [], error: null, total: 0 };
  }

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  let query = supabase
    .from("newsletters")
    .select("*", { count: "exact" })
    .eq("email_id", accountId)
    .order("published_at", { ascending: false });

  if (filters.searchQuery) {
    query = query.ilike("title", `%${filters.searchQuery}%`);
  }

  if (filters.sender) {
    query = query.ilike("sender", `%${filters.sender}%`);
  }

  if (filters.category && filters.category !== "all") {
    query = query.eq("category_id", filters.category);
  }

  if (filters.fromDate) {
    query = query.gte("published_at", filters.fromDate);
  }

  if (filters.toDate) {
    query = query.lte("published_at", filters.toDate);
  }

  query = query.range(startIndex, startIndex + ITEMS_PER_PAGE - 1);

  const { data, error, count } = await query;

  return { data: data || [], error, total: count || 0 };
}

/**
 * Gets statistics for all newsletter senders
 */
export async function getSenderStats(userId: string): Promise<NewsletterSenderStats[]> {
  try {
    console.log(`Fetching sender stats for user: ${userId}`);
    
    // First, get all of the user's email accounts
    const { data: accounts, error: accountsError } = await supabase
      .from("email_accounts")
      .select("id")
      .eq("user_id", userId);
      
    if (accountsError) {
      console.error("Error fetching email accounts:", accountsError);
      throw accountsError;
    }
    
    if (!accounts || accounts.length === 0) {
      console.log("No email accounts found for user");
      return [];
    }
    
    const accountIds = accounts.map(account => account.id);
    
    // Query to get sender statistics
    const { data, error } = await supabase
      .rpc('get_sender_statistics', { account_ids: accountIds });
    
    if (error) {
      console.error("Error fetching sender statistics:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception in getSenderStats:", error);
    throw error;
  }
}
