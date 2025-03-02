import { supabase } from "@/integrations/supabase/client";
import { Newsletter, NewsletterFilters } from "../types";
import { NewsletterFilterOptions, NewsletterSenderStats, NewsletterQueryResult } from "./types";

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

/**
 * Gets newsletter frequency data for analytics
 */
export async function getSenderFrequencyData(userId: string, days: number = 30) {
  try {
    console.log(`Fetching sender frequency data for user: ${userId}, last ${days} days`);
    
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
    
    // Calculate the date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Query to get newsletters with published_at dates for frequency analysis
    const { data, error } = await supabase
      .from('newsletters')
      .select(`
        sender_email,
        published_at
      `)
      .in('email_id', accountIds)
      .gte('published_at', startDate.toISOString())
      .order('published_at');
    
    if (error) {
      console.error("Error fetching newsletter frequency data:", error);
      throw error;
    }
    
    // Process the data by date and sender
    if (!data || data.length === 0) return [];
    
    const frequencyData = data.reduce((result, newsletter) => {
      if (!newsletter.published_at || !newsletter.sender_email) return result;
      
      // Format date to YYYY-MM-DD
      const date = newsletter.published_at.split('T')[0];
      const sender = newsletter.sender_email;
      
      // Find if we already have an entry for this date and sender
      const existingEntry = result.find(item => 
        item.date === date && item.sender === sender
      );
      
      if (existingEntry) {
        // Increment count if entry exists
        existingEntry.count += 1;
      } else {
        // Add new entry if it doesn't exist
        result.push({
          date,
          sender,
          count: 1
        });
      }
      
      return result;
    }, [] as Array<{date: string, sender: string, count: number}>);
    
    return frequencyData;
  } catch (error) {
    console.error("Exception in getSenderFrequencyData:", error);
    throw error;
  }
}
