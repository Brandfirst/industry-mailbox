
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateSyncSchedule } from "@/lib/supabase/emailAccounts/syncLogs";
import { ScheduleSelector } from "./components/ScheduleSelector";
import { ScheduleStatus } from "./components/ScheduleStatus";
import { supabase } from "@/integrations/supabase/client";

export type ScheduleOption = "minute" | "hourly" | "daily" | "disabled";

type SyncScheduleControlsProps = {
  selectedAccount: string | null;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleOption: ScheduleOption;
  setScheduleOption: React.Dispatch<React.SetStateAction<ScheduleOption>>;
  specificHour: string;
  setSpecificHour: React.Dispatch<React.SetStateAction<string>>;
  refreshLogs: () => Promise<void>;
  lastUpdated?: string;
  settingsLoaded?: boolean;
};

export function SyncScheduleControls({
  selectedAccount,
  isEnabled,
  setIsEnabled,
  scheduleOption,
  setScheduleOption,
  specificHour,
  setSpecificHour,
  refreshLogs,
  lastUpdated,
  settingsLoaded = false
}: SyncScheduleControlsProps) {
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
      specificHour,
      settingsLoaded
    });
  }, [selectedAccount, isEnabled, scheduleOption, specificHour, settingsLoaded]);

  // Manual trigger for minute sync when in development/testing
  const triggerManualMinuteSync = async () => {
    if (!selectedAccount || !isEnabled || scheduleOption !== "minute") {
      return;
    }
    
    try {
      // Call the scheduled-sync function directly for immediate testing
      const { data, error } = await supabase.functions.invoke("scheduled-sync", {
        body: { forceRun: true }
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
      }, 5000);
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
        
        // Create a log entry for the scheduled sync if enabled
        if (effectiveEnabled && scheduleOption !== "disabled") {
          try {
            // Import and use the logScheduledSync function from our utils
            await import("@/lib/supabase/emailAccounts/sync/logHandling").then(({ logScheduledSync }) => {
              logScheduledSync(selectedAccount, scheduleOption, hourNumber);
            });
            
            // For minute sync, offer to trigger it manually right away for testing
            if (scheduleOption === "minute") {
              toast("Minute sync scheduled. Want to test it now?", {
                action: {
                  label: "Test Now",
                  onClick: triggerManualMinuteSync
                },
                duration: 10000
              });
            }
          } catch (error) {
            console.error("Error logging scheduled sync:", error);
            // Non-critical error, don't show to user
          }
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

  return (
    <div className="space-y-3">
      <ScheduleSelector
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        scheduleOption={scheduleOption}
        setScheduleOption={setScheduleOption}
        specificHour={specificHour}
        setSpecificHour={setSpecificHour}
        onSaveSchedule={saveSchedule}
        isSaving={isSaving}
        disabled={!selectedAccount || !settingsLoaded}
        selectedAccount={selectedAccount}
      />
      
      <ScheduleStatus
        scheduleOption={scheduleOption}
        specificHour={specificHour}
        isEnabled={isEnabled}
        lastUpdated={saveTimestamp}
      />
      
      {hasSaved && (
        <div className="text-sm text-green-600 mt-2">
          Schedule saved successfully.
        </div>
      )}
      
      {isEnabled && scheduleOption === "minute" && (
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={triggerManualMinuteSync}
            className="w-full bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
          >
            Test Minute Sync Now
          </Button>
          <div className="text-xs text-muted-foreground mt-1">
            This will manually trigger the scheduled sync now for testing
          </div>
        </div>
      )}
    </div>
  );
}
