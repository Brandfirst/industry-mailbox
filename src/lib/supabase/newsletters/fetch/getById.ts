
import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "../../types";
import { debugLog } from "@/lib/utils/content-sanitization/debugUtils";

// Get a single newsletter by ID
export async function getNewsletterById(id: string | number) {
  // Convert string ID to number if it's a string
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  debugLog('Fetching newsletter with ID:', numericId);
  
  // Fetch the newsletter and ensure we get categories
  const { data, error } = await supabase
    .from('newsletters')
    .select('*, categories:category_id(*)')
    .eq('id', numericId)
    .single();
    
  if (error) {
    console.error('Error fetching newsletter by ID:', error);
  }
  
  // Process content to ensure UTF-8 encoding
  if (data && data.content) {
    // Check for Nordic characters in the raw data
    const nordicCharsInRaw = (data.content.match(/[ØÆÅøæå]/g) || []).join('');
    debugLog('NORDIC CHARACTERS IN RAW DB DATA:', nordicCharsInRaw || 'None found');
    
    // If no Nordic characters found, log potential encoding issues
    if (!nordicCharsInRaw) {
      // Check for potentially double-encoded sequences
      const potentialDoubleEncoded = data.content.match(/Ã[…†˜¦ø¸]/g);
      if (potentialDoubleEncoded && potentialDoubleEncoded.length > 0) {
        debugLog('Potential double-encoded characters found in DB data:', 
                    potentialDoubleEncoded.join(', '));
      }
    }
    
    // Convert content to UTF-8 string, ensuring proper encoding
    data.content = String(data.content);
  }
  
  return { data, error };
}
