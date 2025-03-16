
import { supabase } from "@/integrations/supabase/client";
import { SyncLogEntry, SyncScheduleSettings } from './types';

/**
 * Get sync logs for an account
 */
export async function getSyncLogs(accountId: string, limit: number = 20): Promise<SyncLogEntry[]> {
  try {
    console.log(`Fetching up to ${limit} sync logs for account ${accountId}`);
    
    const { data, error } = await supabase.rpc('get_account_sync_logs', {
      account_id_param: accountId,
      limit_param: limit
    });
    
    if (error) {
      console.error("Error fetching sync logs:", error);
      return [];
    }
    
    console.log("Raw sync logs data:", data);
    
    // Ensure data is an array before mapping
    if (!Array.isArray(data)) {
      console.error("Unexpected data format from get_account_sync_logs:", data);
      return [];
    }
    
    console.log(`Retrieved ${data.length} sync logs`);
    
    // For debugging purposes
    if (data.length > 0) {
      console.log("Sample log entry:", data[0]);
    }
    
    return data.map((log: any): SyncLogEntry => {
      // Parse details properly
      let details = {};
      if (log.details) {
        // If details is a string, try to parse it as JSON
        if (typeof log.details === 'string') {
          try {
            details = JSON.parse(log.details);
          } catch (e) {
            console.error("Error parsing log details:", e);
            details = { error: "Failed to parse details" };
          }
        } else if (typeof log.details === 'object') {
          details = log.details;
        }
      }
      
      return {
        id: log.id,
        account_id: log.account_id,
        timestamp: log.timestamp,
        status: log.status as SyncLogEntry['status'],
        message_count: log.message_count || 0,
        error_message: log.error_message || null,
        details: details,
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
    console.log("Fetching sync schedule for account:", accountId);
    
    const { data, error } = await supabase
      .from('email_accounts')
      .select('sync_settings')
      .eq('id', accountId)
      .single();
    
    if (error) {
      console.error("Error fetching sync schedule:", error);
      return null;
    }
    
    console.log("Retrieved sync settings:", data?.sync_settings);
    
    if (!data || !data.sync_settings) {
      console.log("No sync settings found, returning default");
      // Return default settings if none exist
      return {
        enabled: false,
        scheduleType: 'disabled'
      };
    }
    
    // Properly cast the sync_settings to our type
    const settings = data.sync_settings as any;
    
    // Ensure we're using consistent property names (camelCase)
    // Extract scheduleType - handle both camelCase and snake_case keys for backward compatibility
    const scheduleType = settings.scheduleType || settings.schedule_type || 'disabled';
    
    // Build the settings object with consistent naming
    const syncSettings: SyncScheduleSettings = {
      enabled: Boolean(settings.enabled),
      scheduleType: scheduleType as SyncScheduleSettings['scheduleType'],
      hour: typeof settings.hour === 'number' ? settings.hour : undefined,
      updated_at: settings.updated_at
    };
    
    console.log("Parsed sync settings:", syncSettings);
    return syncSettings;
  } catch (error) {
    console.error("Exception fetching sync schedule:", error);
    return null;
  }
}
