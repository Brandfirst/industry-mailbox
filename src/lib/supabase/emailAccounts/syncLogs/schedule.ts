
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
    const { error } = await supabase.rpc('update_sync_schedule', {
      account_id_param: accountId,
      enabled_param: enabled,
      schedule_type_param: scheduleType,
      hour_param: hour !== undefined ? hour : null
    });
    
    if (error) {
      console.error("Error updating sync schedule:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating sync schedule:", error);
    return false;
  }
}
