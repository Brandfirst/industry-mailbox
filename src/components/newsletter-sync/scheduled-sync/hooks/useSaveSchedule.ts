
import { toast } from "sonner";
import { updateSyncSchedule } from "@/lib/supabase/emailAccounts/syncLogs";
import { ScheduleOption } from "../SyncScheduleControls";

/**
 * Handles saving the sync schedule to the database
 */
export async function saveScheduleOperation({
  selectedAccount,
  isEnabled,
  scheduleOption,
  specificHour,
  setIsSaving,
  setHasSaved,
  refreshLogs,
  triggerManualMinuteSync,
  setSaveTimestamp
}: {
  selectedAccount: string | null;
  isEnabled: boolean;
  scheduleOption: ScheduleOption;
  specificHour: string;
  setIsSaving: (value: boolean) => void;
  setHasSaved: (value: boolean) => void;
  refreshLogs: () => Promise<void>;
  triggerManualMinuteSync: () => Promise<void>;
  setSaveTimestamp: (value: string) => void;
}) {
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
}
