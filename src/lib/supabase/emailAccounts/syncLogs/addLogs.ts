
import { supabase } from "@/integrations/supabase/client";
import { SyncLogEntry } from "./types";

/**
 * Add a new sync log entry
 */
export async function addSyncLog(log: SyncLogEntry): Promise<SyncLogEntry | null> {
  try {
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

    // Fix the type assertion issue by using unknown as an intermediate type
    return data as unknown as SyncLogEntry;
  } catch (error) {
    console.error('Exception in addSyncLog:', error);
    return null;
  }
}
