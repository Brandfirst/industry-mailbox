
import { supabase } from "@/integrations/supabase/client";
import { SyncLogEntry, SyncScheduleSettings } from './types';

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
        sync_type: log.sync_type || 'manual'
      };
    });
  } catch (error) {
    console.error("Exception fetching sync logs:", error);
    return [];
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
      scheduleType: (settings.scheduleType || settings.schedule_type || 'disabled') as SyncScheduleSettings['scheduleType'],
      hour: typeof settings.hour === 'number' ? settings.hour : undefined,
      updated_at: settings.updated_at
    };
  } catch (error) {
    console.error("Exception fetching sync schedule:", error);
    return null;
  }
}
