
import { supabase } from "@/integrations/supabase/client";

export interface SyncLogEntry {
  id?: string;
  account_id: string;
  timestamp: string;
  status: 'success' | 'failed' | 'scheduled';
  message_count: number;
  error_message?: string;
  details?: any;
  sync_type?: 'manual' | 'scheduled';
}

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
        details_param: log.details || null,
        sync_type_param: log.sync_type || 'manual'
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

/**
 * Update sync schedule settings for an account
 */
export async function updateSyncSchedule(
  accountId: string, 
  enabled: boolean, 
  scheduleType: string,
  hour?: number
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('update_sync_schedule', {
        account_id_param: accountId,
        enabled_param: enabled,
        schedule_type_param: scheduleType,
        hour_param: hour || null
      });

    if (error) {
      console.error('Error updating sync schedule:', error);
      return false;
    }

    // Log the scheduled sync status
    if (enabled) {
      addSyncLog({
        account_id: accountId,
        status: 'scheduled',
        message_count: 0,
        sync_type: 'scheduled',
        details: { schedule_type: scheduleType, hour: hour },
        timestamp: new Date().toISOString(),
        error_message: null
      });
      
      console.log(`Scheduled sync enabled for account ${accountId}: ${scheduleType}${hour !== undefined ? ` at ${hour}:00` : ''}`);
    } else {
      console.log(`Scheduled sync disabled for account ${accountId}`);
    }

    return !!data;
  } catch (error) {
    console.error('Exception in updateSyncSchedule:', error);
    return false;
  }
}

/**
 * Get current sync schedule for an account
 */
export async function getSyncSchedule(accountId: string): Promise<{
  enabled: boolean;
  scheduleType: string;
  hour?: number;
  lastUpdated?: string;
} | null> {
  try {
    const { data, error } = await supabase
      .from('email_accounts')
      .select('sync_settings')
      .eq('id', accountId)
      .single();
      
    if (error) {
      console.error('Error fetching sync schedule:', error);
      return null;
    }
    
    if (!data || !data.sync_settings) {
      return {
        enabled: false,
        scheduleType: 'disabled'
      };
    }
    
    return {
      enabled: data.sync_settings.enabled || false,
      scheduleType: data.sync_settings.schedule_type || 'disabled',
      hour: data.sync_settings.hour,
      lastUpdated: data.sync_settings.updated_at
    };
  } catch (error) {
    console.error('Exception in getSyncSchedule:', error);
    return null;
  }
}

/**
 * Get the next scheduled sync time
 */
export function getNextSyncTime(scheduleType: string, hour?: number): Date | null {
  if (scheduleType === 'disabled') {
    return null;
  }
  
  const now = new Date();
  const nextSync = new Date();
  
  if (scheduleType === 'hourly') {
    // Set to the next hour
    nextSync.setHours(now.getHours() + 1, 0, 0, 0);
  } else if (scheduleType === 'daily' && hour !== undefined) {
    // Set to the specified hour today
    nextSync.setHours(hour, 0, 0, 0);
    
    // If the specified hour already passed today, set to tomorrow
    if (nextSync.getTime() <= now.getTime()) {
      nextSync.setDate(nextSync.getDate() + 1);
    }
  } else {
    return null;
  }
  
  return nextSync;
}
