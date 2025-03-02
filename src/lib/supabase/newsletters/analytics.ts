
import { supabase } from "@/integrations/supabase/client";
import { NewsletterSenderStats } from "./types";

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
