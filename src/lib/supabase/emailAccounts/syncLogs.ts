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
    const { data, error } = await supabase
      .from('email_sync_logs')
      .select('*')
      .eq('account_id', accountId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching sync logs:', error);
      throw error;
    }

    return data as SyncLogEntry[];
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
    const { data, error } = await supabase
      .from('email_sync_logs')
      .insert(log)
      .select()
      .single();

    if (error) {
      console.error('Error adding sync log:', error);
      throw error;
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
    // Get all logs for this account
    const { data, error } = await supabase
      .from('email_sync_logs')
      .select('id, timestamp')
      .eq('account_id', accountId)
      .order('timestamp', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data || data.length <= keepCount) {
      // No need to delete anything
      return true;
    }

    // Get IDs to delete (all except the most recent keepCount)
    const idsToDelete = data
      .slice(keepCount) // Keep only the oldest ones (after the ones we want to keep)
      .map(log => log.id);

    if (idsToDelete.length === 0) {
      return true;
    }

    // Delete the old logs
    const { error: deleteError } = await supabase
      .from('email_sync_logs')
      .delete()
      .in('id', idsToDelete);

    if (deleteError) {
      throw deleteError;
    }

    return true;
  } catch (error) {
    console.error('Exception in clearOldSyncLogs:', error);
    return false;
  }
}
