
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateSyncSchedule } from "@/lib/supabase/emailAccounts/syncLogs";
import { supabase } from "@/integrations/supabase/client";
import { ScheduleOption } from "../SyncScheduleControls";

export function useSyncSchedule({
  selectedAccount,
  isEnabled,
  setIsEnabled,
  scheduleOption,
  setScheduleOption,
  specificHour, 
  lastUpdated,
  refreshLogs
}: {
  selectedAccount: string | null;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleOption: ScheduleOption;
  setScheduleOption: React.Dispatch<React.SetStateAction<ScheduleOption>>;
  specificHour: string;
  lastUpdated?: string;
  refreshLogs: () => Promise<void>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [saveTimestamp, setSaveTimestamp] = useState<string | undefined>(lastUpdated);
  
  // Update saved timestamp when lastUpdated changes
  useEffect(() => {
    if (lastUpdated) {
      setSaveTimestamp(lastUpdated);
    }
  }, [lastUpdated]);
  
  // Reset saved status when settings change
  useEffect(() => {
    if (hasSaved) {
      setHasSaved(false);
    }
  }, [isEnabled, scheduleOption, specificHour, hasSaved]);

  // Debug log for settings updates
  useEffect(() => {
    console.log("SyncScheduleControls updated:", {
      selectedAccount,
      isEnabled,
      scheduleOption,
      specificHour
    });
  }, [selectedAccount, isEnabled, scheduleOption, specificHour]);
  
  // Subscribe to real-time updates for the selected account
  useEffect(() => {
    if (!selectedAccount) return;
    
    console.log("Setting up real-time subscription for account settings");
    
    const channel = supabase
      .channel('account-settings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'email_accounts',
          filter: `id=eq.${selectedAccount}`
        },
        (payload) => {
          console.log("Real-time account settings update:", payload);
          
          // If sync_settings was updated, refresh the sync logs
          if (payload.new && payload.new.sync_settings !== payload.old?.sync_settings) {
            refreshLogs();
          }
        }
      )
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      console.log("Cleaning up real-time subscription for account settings");
      supabase.removeChannel(channel);
    };
  }, [selectedAccount, refreshLogs]);

  const triggerManualMinuteSync = async () => {
    if (!selectedAccount || !isEnabled || scheduleOption !== "minute") {
      return;
    }
    
    try {
      // Find the most recent log for the account
      const { data: logs } = await supabase
        .from('email_sync_logs')
        .select('id')
        .eq('account_id', selectedAccount)
        .eq('status', 'processing')
        .order('timestamp', { ascending: false })
        .limit(1);
      
      const existingLogId = logs && logs.length > 0 ? logs[0].id : null;
      
      // Call the scheduled-sync function directly with forceRun set to true
      const { data, error } = await supabase.functions.invoke("scheduled-sync", {
        body: { 
          forceRun: true, 
          manual: true,
          accountId: selectedAccount,
          sync_log_id: existingLogId
        }
      });
      
      if (error) {
        console.error("Error manually triggering sync:", error);
        toast.error("Failed to trigger manual sync");
        return;
      }
      
      console.log("Manual sync trigger response:", data);
      toast.success("Manual sync triggered successfully");
      
      // Refresh logs after a delay to see the results
      setTimeout(() => {
        refreshLogs();
      }, 3000);
    } catch (error) {
      console.error("Exception in manual sync trigger:", error);
      toast.error("Error triggering manual sync");
    }
  };

  const saveSchedule = async () => {
    if (!selectedAccount) {
      toast.error("No account selected");
      return;
    }
    
    setIsSaving(true);
    try {
      console.log("Saving schedule with values:", {
        selectedAccount,
        isEnabled,
        scheduleOption,
        specificHour
      });
      
      // Convert specificHour to number
      const hourNumber = scheduleOption === "daily" ? parseInt(specificHour, 10) : undefined;
      
      // Validate hour
      if (scheduleOption === "daily" && (isNaN(hourNumber as number) || hourNumber as number < 0 || hourNumber as number > 23)) {
        toast.error("Please enter a valid hour (0-23)");
        setIsSaving(false);
        return;
      }
      
      // If disabled, force enabled to false
      const effectiveEnabled = scheduleOption === "disabled" ? false : isEnabled;
      
      // Update schedule in database
      const success = await updateSyncSchedule(
        selectedAccount,
        effectiveEnabled,
        scheduleOption,
        hourNumber
      );
      
      if (success) {
        const currentTimestamp = new Date().toISOString();
        setSaveTimestamp(currentTimestamp);
        toast.success("Sync schedule updated");
        setHasSaved(true);
        
        // For minute sync, offer to trigger it manually right away for testing
        if (effectiveEnabled && scheduleOption === "minute") {
          toast("Minute sync scheduled. Want to test it now?", {
            action: {
              label: "Test Now",
              onClick: triggerManualMinuteSync
            },
            duration: 10000
          });
        }
        
        refreshLogs(); // Refresh logs to show new scheduled entry
      } else {
        toast.error("Failed to update sync schedule");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    hasSaved,
    saveTimestamp,
    triggerManualMinuteSync,
    saveSchedule
  };
}
