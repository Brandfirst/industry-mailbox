
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
