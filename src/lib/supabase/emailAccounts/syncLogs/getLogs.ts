
import { supabase } from "@/integrations/supabase/client";
import { SyncLogEntry } from "./types";

/**
 * Get sync logs for a specific email account
 */
export async function getSyncLogs(accountId: string, limit: number = 10): Promise<SyncLogEntry[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_account_sync_logs', { 
        account_id_param: accountId,
        limit_param: limit
      });

    if (error) {
      console.error('Error fetching sync logs:', error);
      return [];
    }

    // Fix the type assertion issue by using unknown as an intermediate type
    return (data || []) as unknown as SyncLogEntry[];
  } catch (error) {
    console.error('Exception in getSyncLogs:', error);
    return [];
  }
}

/**
 * Clear old sync logs (keep only the most recent ones)
 */
export async function clearOldSyncLogs(accountId: string, keepCount: number = 50): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('clear_old_sync_logs', { 
        account_id_param: accountId,
        keep_count_param: keepCount
      });

    if (error) {
      console.error('Error clearing old sync logs:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Exception in clearOldSyncLogs:', error);
    return false;
  }
}
