
import { supabase } from "@/integrations/supabase/client";

export interface SyncLogEntry {
  id: string;
  account_id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'partial' | 'scheduled';
  message_count: number;
  error_message?: string;
  details?: {
    [key: string]: any;
  };
  sync_type?: 'manual' | 'scheduled';
}

interface SyncLogInput {
  account_id: string;
  status: SyncLogEntry['status'];
  message_count: number;
  error_message?: string;
  details?: {
    [key: string]: any;
  };
  timestamp: string;
  sync_type?: 'manual' | 'scheduled';
}

export interface SyncScheduleSettings {
  enabled: boolean;
  scheduleType: 'minute' | 'hourly' | 'daily' | 'disabled';
  hour?: number;
  updated_at?: string;
}

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

/**
 * Get sync logs for an account
 */
export async function getSyncLogs(accountId: string, limit: number = 10): Promise<SyncLogEntry[]> {
  try {
    const { data, error } = await supabase.rpc('get_account_sync_logs', {
      account_id_param: accountId,
      limit_param: limit
    });
    
    if (error) {
      console.error("Error fetching sync logs:", error);
      return [];
    }
    
    // Ensure data is an array before mapping
    if (!Array.isArray(data)) {
      console.error("Unexpected data format from get_account_sync_logs:", data);
      return [];
    }
    
    return data.map((log: any): SyncLogEntry => {
      return {
        id: log.id,
        account_id: log.account_id,
        timestamp: log.timestamp,
        status: log.status as SyncLogEntry['status'],
        message_count: log.message_count,
        error_message: log.error_message,
        // Ensure details is properly parsed as an object
        details: typeof log.details === 'object' ? log.details : {},
        // Set a default sync_type if it's missing
        sync_type: 'manual'
      };
    });
  } catch (error) {
    console.error("Exception fetching sync logs:", error);
    return [];
  }
}

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

/**
 * Get sync schedule for an account
 */
export async function getSyncSchedule(accountId: string): Promise<SyncScheduleSettings | null> {
  try {
    const { data, error } = await supabase
      .from('email_accounts')
      .select('sync_settings')
      .eq('id', accountId)
      .single();
    
    if (error) {
      console.error("Error fetching sync schedule:", error);
      return null;
    }
    
    if (!data || !data.sync_settings) {
      // Return default settings if none exist
      return {
        enabled: false,
        scheduleType: 'disabled'
      };
    }
    
    // Properly cast the sync_settings to our type
    const settings = data.sync_settings as any;
    
    return {
      enabled: Boolean(settings.enabled),
      scheduleType: (settings.scheduleType || 'disabled') as SyncScheduleSettings['scheduleType'],
      hour: typeof settings.hour === 'number' ? settings.hour : undefined,
      updated_at: settings.updated_at
    };
  } catch (error) {
    console.error("Exception fetching sync schedule:", error);
    return null;
  }
}

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
