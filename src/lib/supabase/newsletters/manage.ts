
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
    // First, update all newsletters with this sender_email using the RPC function
    const { error: newslettersError } = await supabase.rpc('update_sender_brand', {
      p_sender_email: senderEmail,
      p_brand_name: brandName
    });
    
    if (newslettersError) {
      console.error('Error in RPC call for newsletters:', newslettersError);
      throw newslettersError;
    }
    
    // We don't try to update the sender stats view directly anymore since
    // it's a view and will reflect the changes in the newsletters table
    
    console.log(`Updated brand to "${brandName}" for newsletters from ${senderEmail}`);
    return true;
  } catch (error) {
    console.error('Error updating brand for sender:', error);
    throw error;
  }
};
