
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateSyncSchedule } from "@/lib/supabase/emailAccounts/syncLogs";
import { ScheduleSelector } from "./components/ScheduleSelector";
import { ScheduleStatus } from "./components/ScheduleStatus";

export type ScheduleOption = "hourly" | "daily" | "disabled";

type SyncScheduleControlsProps = {
  selectedAccount: string | null;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleOption: ScheduleOption;
  setScheduleOption: React.Dispatch<React.SetStateAction<ScheduleOption>>;
  specificHour: string;
  setSpecificHour: React.Dispatch<React.SetStateAction<string>>;
  refreshLogs: () => Promise<void>;
};

export function SyncScheduleControls({
  selectedAccount,
  isEnabled,
  setIsEnabled,
  scheduleOption,
  setScheduleOption,
  specificHour,
  setSpecificHour,
  refreshLogs
}: SyncScheduleControlsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  
  // Reset saved status when settings change
  useEffect(() => {
    if (hasSaved) {
      setHasSaved(false);
    }
  }, [isEnabled, scheduleOption, specificHour, hasSaved]);

  const saveSchedule = async () => {
    if (!selectedAccount) {
      toast.error("No account selected");
      return;
    }
    
    setIsSaving(true);
    try {
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
        toast.success("Sync schedule updated");
        setHasSaved(true);
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
        disabled={!selectedAccount}
        selectedAccount={selectedAccount}
      />
      
      <ScheduleStatus
        scheduleOption={scheduleOption}
        specificHour={specificHour}
      />
      
      {hasSaved && (
        <div className="text-sm text-green-600 mt-2">
          Schedule saved successfully.
        </div>
      )}
    </div>
  );
}
