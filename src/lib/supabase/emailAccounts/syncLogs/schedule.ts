
import { supabase } from "@/integrations/supabase/client";
import { SyncSchedule } from "./types";
import { addSyncLog } from "./addLogs";

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
        timestamp: new Date().toISOString()
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
export async function getSyncSchedule(accountId: string): Promise<SyncSchedule | null> {
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
    
    // Properly cast the sync_settings to access its properties safely
    const settings = data.sync_settings as {
      enabled: boolean;
      schedule_type: string;
      hour?: number;
      updated_at?: string;
    };
    
    return {
      enabled: settings.enabled || false,
      scheduleType: settings.schedule_type || 'disabled',
      hour: settings.hour,
      lastUpdated: settings.updated_at
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
