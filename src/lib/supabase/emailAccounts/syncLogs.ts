
import { supabase } from "@/integrations/supabase/client";

/**
 * Interface for sync log entries
 */
export interface SyncLogEntry {
  id: string;
  account_id: string;
  timestamp: string;
  status: 'success' | 'partial' | 'failed' | 'scheduled';
  message_count: number;
  error_message?: string | null;
  details?: any;
  sync_type?: 'manual' | 'scheduled';
}

/**
 * Add a sync log entry
 */
export async function addSyncLog(logData: {
  account_id: string;
  status: 'success' | 'partial' | 'failed' | 'scheduled';
  message_count: number;
  error_message?: string | null;
  details?: any;
  timestamp?: string;
  sync_type?: 'manual' | 'scheduled';
}) {
  try {
    // First try to use the RPC function
    const { data, error } = await supabase.rpc('add_sync_log', {
      account_id_param: logData.account_id,
      status_param: logData.status,
      message_count_param: logData.message_count,
      error_message_param: logData.error_message || null,
      details_param: logData.details ? JSON.stringify(logData.details) : null
    });
    
    if (error) {
      console.error("Error adding sync log via RPC:", error);
      
      // Fallback to direct insert if RPC fails
      try {
        // Set up the log data
        const insertData = {
          account_id: logData.account_id,
          status: logData.status, 
          message_count: logData.message_count,
          error_message: logData.error_message,
          details: logData.details ? {
            ...logData.details,
            sync_type: logData.sync_type || 'manual'
          } : { sync_type: logData.sync_type || 'manual' },
          timestamp: logData.timestamp || new Date().toISOString()
        };
        
        // For scheduled status which isn't in the DB enum, use 'success' instead
        if (insertData.status === 'scheduled') {
          insertData.status = 'success';
        }
        
        const { error: insertError } = await supabase
          .from('email_sync_logs')
          .insert(insertData);
          
        if (insertError) {
          console.error("Error inserting sync log:", insertError);
        }
      } catch (insertCatchError) {
        console.error("Exception during sync log insert:", insertCatchError);
      }
    }
    
    return { success: true };
  } catch (e) {
    console.error("Exception in addSyncLog:", e);
    return { success: false, error: e };
  }
}

/**
 * Get sync logs for an account
 */
export async function getSyncLogs(accountId: string, limit: number = 10): Promise<SyncLogEntry[]> {
  try {
    // First try to use the RPC function
    const { data, error } = await supabase.rpc('get_account_sync_logs', {
      account_id_param: accountId,
      limit_param: limit
    });
    
    if (error) {
      console.error("Error getting sync logs via RPC:", error);
      
      // Fallback to direct query if RPC fails
      try {
        const { data: queryData, error: queryError } = await supabase
          .from('email_sync_logs')
          .select('*')
          .eq('account_id', accountId)
          .order('timestamp', { ascending: false })
          .limit(limit);
          
        if (queryError) {
          console.error("Error querying sync logs:", queryError);
          return [];
        }
        
        return (queryData || []).map(log => ({
          ...log,
          sync_type: log.details?.sync_type || 'manual'
        })) as SyncLogEntry[];
      } catch (e) {
        console.error("Exception in fallback getSyncLogs query:", e);
        return [];
      }
    }
    
    // Process the data to add any missing fields
    return (data || []).map(log => {
      // Extract sync_type from details if it exists
      const details = typeof log.details === 'string' 
        ? JSON.parse(log.details) 
        : log.details || {};
      
      return {
        ...log,
        sync_type: details.sync_type || 'manual'
      };
    }) as SyncLogEntry[];
  } catch (e) {
    console.error("Exception in getSyncLogs:", e);
    return [];
  }
}

/**
 * Get sync schedule settings for an account
 */
export async function getSyncSchedule(accountId: string) {
  try {
    const { data, error } = await supabase
      .from('email_accounts')
      .select('sync_settings')
      .eq('id', accountId)
      .single();
      
    if (error) {
      console.error("Error getting sync schedule:", error);
      return null;
    }
    
    if (!data || !data.sync_settings) {
      return {
        enabled: false,
        scheduleType: 'daily',
        hour: 9
      };
    }
    
    return data.sync_settings;
  } catch (e) {
    console.error("Exception in getSyncSchedule:", e);
    return null;
  }
}

/**
 * Update sync schedule settings for an account
 */
export async function updateSyncSchedule(
  accountId: string,
  settings: {
    enabled: boolean;
    scheduleType: string;
    hour?: number;
  }
) {
  try {
    const { data, error } = await supabase.rpc('update_sync_schedule', {
      account_id_param: accountId,
      enabled_param: settings.enabled,
      schedule_type_param: settings.scheduleType,
      hour_param: settings.hour
    });
    
    if (error) {
      console.error("Error updating sync schedule:", error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error("Exception in updateSyncSchedule:", e);
    return false;
  }
}

/**
 * Get next sync time based on schedule
 */
export function getNextSyncTime(scheduleType: string, hour?: number): string {
  const now = new Date();
  const nextSync = new Date();
  
  if (scheduleType === 'hourly') {
    // Set to the next hour
    nextSync.setHours(now.getHours() + 1, 0, 0, 0);
  } else if (scheduleType === 'daily' && hour !== undefined) {
    // Set to specified hour today or tomorrow if that hour already passed
    nextSync.setHours(hour, 0, 0, 0);
    if (nextSync < now) {
      nextSync.setDate(nextSync.getDate() + 1);
    }
  } else {
    // Default to tomorrow at 9 AM
    nextSync.setDate(nextSync.getDate() + 1);
    nextSync.setHours(9, 0, 0, 0);
  }
  
  return nextSync.toLocaleString();
}
