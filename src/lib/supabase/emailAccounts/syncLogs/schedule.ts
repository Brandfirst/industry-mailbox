
import { supabase } from "@/integrations/supabase/client";
import { ScheduleOption, SyncScheduleSettings } from "./types";

/**
 * Gets the current sync schedule settings for an account
 */
export async function getSyncSchedule(accountId: string): Promise<SyncScheduleSettings | null> {
  try {
    console.log("Getting sync schedule for account:", accountId);
    const { data, error } = await supabase
      .from("email_accounts")
      .select("sync_settings")
      .eq("id", accountId)
      .single();
    
    if (error) {
      console.error("Error retrieving sync schedule:", error);
      return null;
    }
    
    // If no sync settings are configured yet, return defaults
    if (!data || !data.sync_settings) {
      return {
        enabled: false,
        scheduleType: "disabled" as ScheduleOption,
        hour: null,
        updated_at: undefined
      };
    }
    
    // Safely convert the JSON data to SyncScheduleSettings
    const settings = data.sync_settings as Record<string, any>;
    
    return {
      enabled: !!settings.enabled,
      scheduleType: (settings.scheduleType || settings.schedule_type || "disabled") as ScheduleOption,
      hour: settings.hour !== undefined ? settings.hour : null,
      updated_at: settings.updated_at
    };
  } catch (error) {
    console.error("Exception getting sync schedule:", error);
    return null;
  }
}

/**
 * Updates the sync schedule settings for an account
 */
export async function updateSyncSchedule(
  accountId: string, 
  enabled: boolean,
  scheduleType: ScheduleOption,
  hour?: number | null
): Promise<boolean> {
  try {
    const settings: SyncScheduleSettings = {
      enabled: enabled,
      scheduleType: scheduleType,
      hour: hour,
      updated_at: new Date().toISOString()
    };
    
    console.log("Updating sync schedule for account:", accountId, settings);
    
    // Convert the settings to a JSON object that Supabase can store
    const jsonSettings = {
      enabled: settings.enabled,
      scheduleType: settings.scheduleType,
      hour: settings.hour,
      updated_at: settings.updated_at
    };
    
    const { error } = await supabase
      .from("email_accounts")
      .update({ 
        sync_settings: jsonSettings 
      })
      .eq("id", accountId);
    
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
