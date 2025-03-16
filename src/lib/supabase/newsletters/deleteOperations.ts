
import { supabase } from "@/integrations/supabase/client";

/**
 * Delete newsletters by IDs
 */
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
