
import { supabase } from "@/integrations/supabase/client";
import { Newsletter, NewsletterFilters } from "../types";
import { NewsletterFilterOptions, NewsletterSenderStats } from "./types";

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
    query = query.eq("category_id", Number(filters.category));
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
    
    // Fix: change RPC function name from get_sender_statistics to update_admin_stats
    // Query to get sender statistics - we'll need to create a custom query since the RPC doesn't exist
    const { data, error } = await supabase
      .from('newsletters')
      .select(`
        sender_email,
        sender,
        category_id,
        published_at
      `)
      .in('email_id', accountIds)
      .order('sender_email');
    
    if (error) {
      console.error("Error fetching sender statistics:", error);
      throw error;
    }
    
    // Process the data to get stats by sender
    if (!data) return [];
    
    const statsMap = new Map<string, NewsletterSenderStats>();
    
    data.forEach(newsletter => {
      const senderEmail = newsletter.sender_email || '';
      
      if (!statsMap.has(senderEmail)) {
        statsMap.set(senderEmail, {
          sender_email: senderEmail,
          sender_name: newsletter.sender || '',
          newsletter_count: 0,
          last_sync_date: null,
          category_id: newsletter.category_id
        });
      }
      
      const stats = statsMap.get(senderEmail)!;
      stats.newsletter_count++;
      
      // Track the latest date
      const publishedDate = newsletter.published_at;
      if (publishedDate && (!stats.last_sync_date || publishedDate > stats.last_sync_date)) {
        stats.last_sync_date = publishedDate;
      }
    });
    
    return Array.from(statsMap.values());
  } catch (error) {
    console.error("Exception in getSenderStats:", error);
    throw error;
  }
}
