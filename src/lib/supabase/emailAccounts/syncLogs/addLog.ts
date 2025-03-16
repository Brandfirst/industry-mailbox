
import { supabase } from "@/integrations/supabase/client";
import { SyncLogEntry, SyncLogInput } from './types';

/**
 * Add a new sync log entry
 */
export async function addSyncLog(logData: SyncLogInput): Promise<SyncLogEntry | null> {
  try {
    // Call the database function
    const { data, error } = await supabase.rpc('add_sync_log', {
      account_id_param: logData.account_id,
      status_param: logData.status,
      message_count_param: logData.message_count,
      error_message_param: logData.error_message || null,
      details_param: logData.details ? logData.details : null
    });
    
    if (error) {
      console.error("Error adding sync log:", error);
      return null;
    }
    
    // Convert from the returned database format to our TypeScript interface
    // Cast data to any to safely access properties
    const typedData = data as any;
    
    return {
      id: typedData.id,
      account_id: typedData.account_id,
      timestamp: typedData.timestamp,
      status: typedData.status,
      message_count: typedData.message_count,
      error_message: typedData.error_message,
      details: typedData.details,
      sync_type: logData.sync_type
    };
  } catch (error) {
    console.error("Exception adding sync log:", error);
    return null;
  }
}
