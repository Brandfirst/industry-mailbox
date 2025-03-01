import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "./types";

// Define interface for the filter options
interface NewsletterFilterOptions {
  searchQuery?: string;
  sender?: string;
  categoryId?: number | string;
  fromDate?: Date | string;
  toDate?: Date | string;
  page?: number;
  limit?: number;
  industries?: string[];
  accountId?: string;
}

// Simple function to get newsletters with pagination
export async function getNewsletters(options: NewsletterFilterOptions = {}) {
  // Use simple implementation to avoid TypeScript errors
  const page = options.page || 1;
  const limit = options.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  let query = supabase
    .from("newsletters")
    .select("*, categories(id, name, slug, color)");
    
  // Apply filters if provided
  if (options.searchQuery) {
    query = query.or(`title.ilike.%${options.searchQuery}%,content.ilike.%${options.searchQuery}%`);
  }
  
  if (options.sender) {
    query = query.ilike('sender', `%${options.sender}%`);
  }

  if (options.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }

  if (options.fromDate) {
    query = query.gte('published_at', options.fromDate);
  }

  if (options.toDate) {
    // Add a day to include the entire "to" day
    const nextDay = new Date(options.toDate instanceof Date ? options.toDate : new Date(options.toDate));
    nextDay.setDate(nextDay.getDate() + 1);
    query = query.lt('published_at', nextDay.toISOString());
  }
  
  if (options.industries && options.industries.length > 0) {
    query = query.in('industry', options.industries);
  }
  
  const { data, error, count } = await query.range(from, to);
  
  if (error) {
    console.error("Error fetching newsletters:", error);
    throw error;
  }
  
  return { data: data || [], count };
}

// Get newsletters from a specific email account
export async function getNewslettersFromEmailAccount(accountId: string, page = 1, limit = 50, filters: NewsletterFilterOptions = {}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase
      .from("newsletters")
      .select("*, categories(id, name, slug, color)", { count: "exact" })
      .eq("email_id", accountId);

    // Apply additional filters
    if (filters.searchQuery) {
      query = query.or(`title.ilike.%${filters.searchQuery}%,content.ilike.%${filters.searchQuery}%`);
    }
    
    if (filters.sender) {
      query = query.ilike('sender', `%${filters.sender}%`);
    }

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters.fromDate) {
      query = query.gte('published_at', filters.fromDate);
    }

    if (filters.toDate) {
      // Add a day to include the entire "to" day
      const nextDay = new Date(filters.toDate instanceof Date ? filters.toDate : new Date(filters.toDate));
      nextDay.setDate(nextDay.getDate() + 1);
      query = query.lt('published_at', nextDay.toISOString());
    }

    const { data, error, count } = await query
      .range(from, to)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching newsletters for email account:", error);
      throw error;
    }

    return { data: data || [], count };
  } catch (error) {
    console.error("Error in getNewslettersFromEmailAccount:", error);
    throw error;
  }
}

export async function getNewsletterById(id) {
  const { data, error } = await supabase
    .from("newsletters")
    .select("*, categories(id, name, slug, color)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching newsletter:", error);
    throw error;
  }

  return data;
}

// Delete multiple newsletters by their IDs
export async function deleteNewsletters(newsletterIds: number[]) {
  if (!newsletterIds || newsletterIds.length === 0) {
    console.warn("No newsletter IDs provided for deletion");
    return { success: true, count: 0 };
  }

  try {
    const { error } = await supabase
      .from("newsletters")
      .delete()
      .in("id", newsletterIds);

    if (error) {
      console.error("Error deleting newsletters:", error);
      throw error;
    }

    return { success: true, count: newsletterIds.length };
  } catch (error) {
    console.error("Error in deleteNewsletters:", error);
    throw error;
  }
}

export async function saveUserNewsletter(userId, newsletterId) {
  const { data, error } = await supabase
    .from("saved_newsletters")
    .insert({
      user_id: userId,
      newsletter_id: newsletterId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving newsletter:", error);
    throw error;
  }

  return data;
}

export async function unsaveUserNewsletter(userId, newsletterId) {
  const { data, error } = await supabase
    .from("saved_newsletters")
    .delete()
    .eq("user_id", userId)
    .eq("newsletter_id", newsletterId)
    .select()
    .single();

  if (error) {
    console.error("Error unsaving newsletter:", error);
    throw error;
  }

  return data;
}

export async function getUserSavedNewsletters(userId, page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("saved_newsletters")
    .select("newsletter_id, newsletters!inner(*, categories(id, name, slug, color))", {
      count: "exact",
    })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching saved newsletters:", error);
    throw error;
  }

  // Transform the data to get just the newsletters
  const newsletters = data.map((item) => item.newsletters);

  return { data: newsletters, count };
}

// Update newsletter category
export async function updateNewsletterCategory(newsletterId: number, categoryId: number | null) {
  try {
    const { error } = await supabase
      .from("newsletters")
      .update({ 
        category_id: categoryId 
      })
      .eq("id", newsletterId);

    if (error) {
      console.error("Error updating newsletter category:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateNewsletterCategory:", error);
    throw error;
  }
}

// Check if a newsletter is saved by a user
export async function isNewsletterSaved(userId, newsletterId) {
  const { data, error } = await supabase
    .from("saved_newsletters")
    .select("*")
    .eq("user_id", userId)
    .eq("newsletter_id", newsletterId)
    .maybeSingle();

  if (error) {
    console.error("Error checking if newsletter is saved:", error);
    throw error;
  }

  return !!data;
}

// Alias functions for backward compatibility
export const saveNewsletter = saveUserNewsletter;
export const unsaveNewsletter = unsaveUserNewsletter;
