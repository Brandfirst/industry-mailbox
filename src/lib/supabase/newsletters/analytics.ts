
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
