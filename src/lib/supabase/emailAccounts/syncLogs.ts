
import { supabase } from "@/integrations/supabase/client";

export interface SyncLogEntry {
  id?: string;
  account_id: string;
  timestamp: string;
  status: 'success' | 'failed';
  message_count: number;
  error_message?: string;
  details?: any;
}

/**
 * Get sync logs for a specific email account
 */
export async function getSyncLogs(accountId: string, limit: number = 10): Promise<SyncLogEntry[]> {
  try {
    // Using a raw query to get around type system limitations
    // Since our table exists in the database but is not in the generated types
    const { data, error } = await supabase
      .rpc('get_account_sync_logs', { 
        account_id_param: accountId,
        limit_param: limit
      });

    if (error) {
      console.error('Error fetching sync logs:', error);
      return [];
    }

    return (data || []) as SyncLogEntry[];
  } catch (error) {
    console.error('Exception in getSyncLogs:', error);
    return [];
  }
}

/**
 * Add a new sync log entry
 */
export async function addSyncLog(log: SyncLogEntry): Promise<SyncLogEntry | null> {
  try {
    // Using a raw query to get around type system limitations
    const { data, error } = await supabase
      .rpc('add_sync_log', { 
        account_id_param: log.account_id,
        status_param: log.status,
        message_count_param: log.message_count,
        error_message_param: log.error_message || null,
        details_param: log.details || null
      });

    if (error) {
      console.error('Error adding sync log:', error);
      return null;
    }

    return data as SyncLogEntry;
  } catch (error) {
    console.error('Exception in addSyncLog:', error);
    return null;
  }
}

/**
 * Clear old sync logs (keep only the most recent ones)
 */
export async function clearOldSyncLogs(accountId: string, keepCount: number = 50): Promise<boolean> {
  try {
    // Using a raw query to get around type system limitations
    const { error } = await supabase
      .rpc('clear_old_sync_logs', { 
        account_id_param: accountId,
        keep_count_param: keepCount
      });

    if (error) {
      console.error('Error clearing old sync logs:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception in clearOldSyncLogs:', error);
    return false;
  }
}
