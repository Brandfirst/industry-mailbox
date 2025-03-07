import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "../types";
import { NewsletterFilterOptions } from "./types";

// Update multiple newsletters' categories
export async function updateNewsletterCategories(
  updates: Array<{ id: number; category_id: number | null }>,
  applySenderWide: boolean = false
) {
  try {
    if (!updates || updates.length === 0) {
      return { success: true, count: 0 };
    }

    console.log(`Updating ${updates.length} newsletter categories, applySenderWide: ${applySenderWide}`);
    const results = [];

    // If applying sender-wide, we need to group by sender first
    if (applySenderWide) {
      // First, get all the newsletters that are being updated to find their senders
      const newsletterIds = updates.map(update => update.id);
      const { data: newsletters, error: fetchError } = await supabase
        .from("newsletters")
        .select("id, sender_email, category_id")
        .in("id", newsletterIds);

      if (fetchError) {
        console.error("Error fetching newsletters for sender-wide update:", fetchError);
        throw fetchError;
      }

      // Create a map of newsletter IDs to their data for easy lookup
      const newsletterMap = new Map();
      newsletters?.forEach(newsletter => {
        newsletterMap.set(newsletter.id, newsletter);
      });

      // Process each update
      for (const update of updates) {
        const newsletter = newsletterMap.get(update.id);
        if (!newsletter || !newsletter.sender_email) {
          // Just update this individual newsletter if we can't find sender info
          const { error } = await supabase
            .from("newsletters")
            .update({ category_id: update.category_id })
            .eq("id", update.id);
          
          if (error) {
            console.error(`Error updating newsletter ${update.id}:`, error);
            results.push({ id: update.id, success: false, error });
          } else {
            results.push({ id: update.id, success: true });
          }
          continue;
        }

        // Apply the category change to all newsletters from this sender
        const { error } = await supabase
          .from("newsletters")
          .update({ category_id: update.category_id })
          .eq("sender_email", newsletter.sender_email);
        
        if (error) {
          console.error(`Error updating newsletters for sender ${newsletter.sender_email}:`, error);
          results.push({ id: update.id, success: false, error });
        } else {
          results.push({ id: update.id, success: true });
        }
      }
    } else {
      // Just update individual newsletters
      for (const update of updates) {
        const { error } = await supabase
          .from("newsletters")
          .update({ category_id: update.category_id })
          .eq("id", update.id);
        
        if (error) {
          console.error(`Error updating newsletter ${update.id}:`, error);
          results.push({ id: update.id, success: false, error });
        } else {
          results.push({ id: update.id, success: true });
        }
      }
    }

    return { 
      success: true, 
      count: results.filter(r => r.success).length,
      results 
    };
  } catch (error) {
    console.error("Error in updateNewsletterCategories:", error);
    throw error;
  }
}

// Delete newsletters by IDs
export async function deleteNewsletters(ids: number[]): Promise<{ success: boolean; count: number }> {
  try {
    if (!ids || ids.length === 0) {
      return { success: true, count: 0 };
    }

    console.log(`Deleting ${ids.length} newsletters`);
    
    const { error } = await supabase
      .from("newsletters")
      .delete()
      .in("id", ids);
    
    if (error) {
      console.error("Error deleting newsletters:", error);
      throw error;
    }
    
    return { 
      success: true, 
      count: ids.length
    };
  } catch (error) {
    console.error("Error in deleteNewsletters:", error);
    throw error;
  }
}

// Functions for saved newsletters
export async function saveNewsletter(newsletterId: number, userId: string) {
  try {
    const { error } = await supabase
      .from("saved_newsletters")
      .insert({ newsletter_id: newsletterId, user_id: userId });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving newsletter:", error);
    throw error;
  }
}

export async function unsaveNewsletter(newsletterId: number, userId: string) {
  try {
    const { error } = await supabase
      .from("saved_newsletters")
      .delete()
      .eq("newsletter_id", newsletterId)
      .eq("user_id", userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error unsaving newsletter:", error);
    throw error;
  }
}

export async function isNewsletterSaved(newsletterId: number, userId: string) {
  try {
    const { data, error } = await supabase
      .from("saved_newsletters")
      .select("id")
      .eq("newsletter_id", newsletterId)
      .eq("user_id", userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    
    return !!data; // Returns true if data exists, false otherwise
  } catch (error) {
    console.error("Error checking if newsletter is saved:", error);
    throw error;
  }
}

// Sync email account newsletters - function to bridge the Edge Function call
export async function syncEmailAccountNewsletters(accountId: string) {
  try {
    if (!accountId) {
      return { success: false, error: "No account ID provided" };
    }

    console.log("Syncing newsletters for account:", accountId);
    
    // We'll use the existing syncEmailAccount function from emailAccounts
    const { syncEmailAccount } = await import("../emailAccounts");
    const result = await syncEmailAccount(accountId);
    
    // Format the response to match what our component expects
    return {
      success: result.success,
      count: result.count || 0,
      error: result.error || null,
      warnings: result.warning ? [result.warning] : [],
    };
  } catch (error) {
    console.error("Error in syncEmailAccountNewsletters:", error);
    return {
      success: false,
      count: 0,
      error: `Failed to sync newsletters: ${error.message || String(error)}`,
    };
  }
}

// Gets newsletters with pagination and optional filtering
export function getNewsletters(options: NewsletterFilterOptions = {}) {
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

  return query.range(startRow, endRow);
}
