
import { supabase } from "@/integrations/supabase/client";
import { DeleteNewslettersResponse } from "./types";

// Delete multiple newsletters by their IDs
export async function deleteNewsletters(newsletterIds: number[]): Promise<DeleteNewslettersResponse> {
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

/**
 * Updates the category for all newsletters from a specific sender
 */
export async function updateSenderCategory(
  senderEmail: string, 
  categoryId: number | null,
  userId: string
): Promise<void> {
  try {
    console.log(`Updating category to ${categoryId} for all newsletters from sender: ${senderEmail}`);
    
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
      return;
    }
    
    const accountIds = accounts.map(account => account.id);
    
    // Update all newsletters from this sender across all user's email accounts
    const { error: updateError } = await supabase
      .from("newsletters")
      .update({ category_id: categoryId })
      .in("email_id", accountIds)
      .eq("sender_email", senderEmail);
      
    if (updateError) {
      console.error("Error updating newsletter categories:", updateError);
      throw updateError;
    }
    
    console.log(`Successfully updated category for all newsletters from ${senderEmail}`);
  } catch (error) {
    console.error("Exception in updateSenderCategory:", error);
    throw error;
  }
}

export function saveNewsletter(newsletterId: number, userId: string) {
  return supabase
    .from('saved_newsletters')
    .insert({
      newsletter_id: newsletterId,
      user_id: userId
    });
}

export function unsaveNewsletter(newsletterId: number, userId: string) {
  return supabase
    .from('saved_newsletters')
    .delete()
    .match({
      newsletter_id: newsletterId,
      user_id: userId
    });
}

export async function isNewsletterSaved(newsletterId: number, userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('saved_newsletters')
    .select('id')
    .match({
      newsletter_id: newsletterId,
      user_id: userId
    })
    .single();
  
  if (error && error.code !== 'PGSQL_ERROR_NO_DATA_FOUND') {
    console.error('Error checking if newsletter is saved:', error);
  }
  
  return !!data;
}
