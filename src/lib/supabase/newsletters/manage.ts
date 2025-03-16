
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
    // First, verify the sender email is not empty
    if (!senderEmail) {
      throw new Error('Sender email is required');
    }
    
    console.log(`Updating brand to "${brandName}" for sender: ${senderEmail}`);
    
    // Update all newsletters with this sender_email using the RPC function
    const { data, error: newslettersError } = await supabase.rpc('update_sender_brand', {
      p_sender_email: senderEmail,
      p_brand_name: brandName
    });
    
    if (newslettersError) {
      console.error('Error in RPC call for newsletters:', newslettersError);
      throw newslettersError;
    }
    
    console.log(`RPC update_sender_brand result:`, data);
    console.log(`Updated brand to "${brandName}" for newsletters from ${senderEmail}`);
    
    // Verify the update worked by checking a sample newsletter
    const { data: checkData, error: checkError } = await supabase
      .from('newsletters')
      .select('brand_name')
      .eq('sender_email', senderEmail)
      .limit(1);
    
    if (checkError) {
      console.error('Error verifying brand update:', checkError);
    } else if (checkData && checkData.length > 0) {
      console.log(`Verification - sample newsletter brand value: "${checkData[0].brand_name}"`);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating brand for sender:', error);
    throw error;
  }
};
