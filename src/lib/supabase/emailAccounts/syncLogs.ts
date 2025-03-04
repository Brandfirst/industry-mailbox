
import { supabase } from "@/integrations/supabase/client";

export type SyncLogEntry = {
  id?: string;
  account_id: string;
  timestamp: string;
  status: "success" | "failed";
  message_count: number;
  error_message?: string;
  details?: any;
};

/**
 * Fetches sync logs for a specific email account
 */
export async function getSyncLogs(accountId: string, limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('email_sync_logs')
      .select('*')
      .eq('account_id', accountId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching sync logs:", error);
      return [];
    }

    return data as SyncLogEntry[];
  } catch (error) {
    console.error("Exception fetching sync logs:", error);
    return [];
  }
}

/**
 * Saves a sync log entry
 */
export async function saveSyncLog(logEntry: SyncLogEntry) {
  try {
    const { data, error } = await supabase
      .from('email_sync_logs')
      .insert(logEntry)
      .select()
      .single();

    if (error) {
      console.error("Error saving sync log:", error);
      return null;
    }

    return data as SyncLogEntry;
  } catch (error) {
    console.error("Exception saving sync log:", error);
    return null;
  }
}

/**
 * Clears old sync logs (older than specified days)
 */
export async function clearOldSyncLogs(accountId: string, olderThanDays: number = 30) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    
    const { error } = await supabase
      .from('email_sync_logs')
      .delete()
      .eq('account_id', accountId)
      .lt('timestamp', cutoffDate.toISOString());

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
