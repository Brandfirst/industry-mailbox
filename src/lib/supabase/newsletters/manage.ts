
import { supabase } from "@/integrations/supabase/client";

/**
 * Update the category for all newsletters from a specific sender
 */
export const updateSenderCategory = async (
  senderEmail: string,
  categoryId: number | null,
  userId: string
) => {
  try {
    const { error } = await supabase
      .from('newsletters')
      .update({ category_id: categoryId })
      .eq('sender_email', senderEmail);
    
    if (error) throw error;
    
    console.log(`Updated category to ${categoryId} for newsletters from ${senderEmail}`);
    return true;
  } catch (error) {
    console.error('Error updating category for sender:', error);
    throw error;
  }
};

/**
 * Update the brand name for a specific sender
 */
export const updateSenderBrand = async (
  senderEmail: string,
  brandName: string,
  userId: string
) => {
  try {
    // Use the RPC function we created to update the brand_name for all newsletters from this sender
    const { error } = await supabase.rpc('update_sender_brand', {
      p_sender_email: senderEmail,
      p_brand_name: brandName
    });
    
    if (error) {
      console.error('Error in RPC call:', error);
      throw error;
    }
    
    console.log(`Updated brand to "${brandName}" for newsletters from ${senderEmail}`);
    return true;
  } catch (error) {
    console.error('Error updating brand for sender:', error);
    throw error;
  }
};
