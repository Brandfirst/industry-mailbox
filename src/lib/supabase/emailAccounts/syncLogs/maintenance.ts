
import { supabase } from "@/integrations/supabase/client";

/**
 * Clear old sync logs to prevent excessive storage use
 */
export async function clearOldSyncLogs(accountId: string, keepCount: number = 50): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('clear_old_sync_logs', {
      account_id_param: accountId,
      keep_count_param: keepCount
    });
    
    if (error) {
      console.error("Error clearing old sync logs:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception clearing old sync logs:", error);
    return false;
  }
}
