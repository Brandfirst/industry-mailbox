
import { supabase } from "@/integrations/supabase/client";

// Save a newsletter for a user
export async function saveUserNewsletter(userId: string, newsletterId: number) {
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

// Unsave a newsletter for a user
export async function unsaveUserNewsletter(userId: string, newsletterId: number) {
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

// Get newsletters saved by a user with pagination
export async function getUserSavedNewsletters(userId: string, page = 1, limit = 10) {
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

// Check if a newsletter is saved by a user
export async function isNewsletterSaved(userId: string, newsletterId: number) {
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
