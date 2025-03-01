import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "./types";

// Simple function to get newsletters with pagination
export async function getNewsletters(options: any = {}) {
  // Use simple implementation to avoid TypeScript errors
  const page = typeof options === 'number' ? options : 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  let query = supabase
    .from("newsletters")
    .select("*, categories(id, name, slug, color)");
    
  // Apply filters if provided
  if (options.searchQuery) {
    query = query.or(`title.ilike.%${options.searchQuery}%,content.ilike.%${options.searchQuery}%`);
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
export async function getNewslettersFromEmailAccount(accountId, page = 1, limit = 50) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data, error, count } = await supabase
      .from("newsletters")
      .select("*, categories(id, name, slug, color)", { count: "exact" })
      .eq("email_id", accountId)
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
