
import { supabase } from "@/integrations/supabase/client";

/**
 * Update sync schedule for an account
 */
export async function updateSyncSchedule(
  accountId: string, 
  enabled: boolean, 
  scheduleType: 'minute' | 'hourly' | 'daily' | 'disabled', 
  hour?: number
): Promise<boolean> {
  try {
    console.log("Updating sync schedule for account:", accountId, {
      enabled, 
      scheduleType, 
      hour
    });
    
    // Create settings object with consistent property naming convention (camelCase)
    const settings = {
      enabled: enabled,
      scheduleType: scheduleType,
      hour: hour !== undefined ? hour : null,
      updated_at: new Date().toISOString()
    };
    
    console.log("Sync settings to save:", settings);
    
    const { error } = await supabase
      .from('email_accounts')
      .update({ sync_settings: settings })
      .eq('id', accountId);
    
    if (error) {
      console.error("Error updating sync schedule:", error);
      return false;
    }
    
    console.log("Sync schedule updated successfully");
    return true;
  } catch (error) {
    console.error("Exception updating sync schedule:", error);
    return false;
  }
}
