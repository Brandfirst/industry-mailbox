
import { supabase } from "@/integrations/supabase/client";
import { SenderFrequencyAnalytics } from "./types";

/**
 * Gets newsletter frequency data for analytics
 */
export async function getSenderFrequencyData(userId: string, days: number = 30): Promise<SenderFrequencyAnalytics[]> {
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
    }, [] as SenderFrequencyAnalytics[]);
    
    return frequencyData;
  } catch (error) {
    console.error("Exception in getSenderFrequencyData:", error);
    throw error;
  }
}

/**
 * Gets top sender frequency statistics for a given time period
 */
export async function getTopSendersFrequency(userId: string, limit: number = 5, days: number = 30): Promise<SenderFrequencyAnalytics[]> {
  try {
    const frequencyData = await getSenderFrequencyData(userId, days);
    
    // Group by sender
    const senderFrequency = frequencyData.reduce((result, item) => {
      const sender = item.sender;
      
      if (!result[sender]) {
        result[sender] = {
          sender,
          totalCount: 0,
          dates: new Set()
        };
      }
      
      result[sender].totalCount += item.count;
      result[sender].dates.add(item.date);
      
      return result;
    }, {} as Record<string, { sender: string, totalCount: number, dates: Set<string> }>);
    
    // Convert to array and sort by total count
    const topSenders = Object.values(senderFrequency)
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, limit)
      .map(sender => ({
        sender: sender.sender,
        count: sender.totalCount,
        date: days.toString(), // Using the time period as date for this aggregated data
        frequency: sender.totalCount / sender.dates.size // Calculate average newsletters per day
      })) as SenderFrequencyAnalytics[];
    
    return topSenders;
  } catch (error) {
    console.error("Exception in getTopSendersFrequency:", error);
    throw error;
  }
}
