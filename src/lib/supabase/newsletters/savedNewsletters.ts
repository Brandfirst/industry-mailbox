
import { supabase } from "@/integrations/supabase/client";

/**
 * Save a newsletter for a user
 */
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

/**
 * Unsave a newsletter for a user
 */
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

/**
 * Check if a newsletter is saved by a user
 */
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
