
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateSyncSchedule, getSyncSchedule, getNextSyncTime } from "@/lib/supabase/emailAccounts/syncLogs";
import { ScheduleSelector, ScheduleStatus } from "./components";
import { logScheduledSync } from "@/lib/supabase/emailAccounts/sync/logHandling";

type ScheduleOption = "hourly" | "daily" | "disabled";

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
  const handleScheduleChange = async (enabled: boolean) => {
    if (!selectedAccount) return;
    
    if (enabled && scheduleOption === "disabled") {
      // If enabling but no option selected, default to daily
      setScheduleOption("daily");
    }
    
    setIsEnabled(enabled);
    
    // Save the schedule settings
    await saveScheduleSettings(enabled);
  };
  
  const saveScheduleSettings = async (enabled: boolean = isEnabled) => {
    if (!selectedAccount) return;
    
    const hourNumber = scheduleOption === "daily" ? parseInt(specificHour, 10) : undefined;
    
    const success = await updateSyncSchedule(selectedAccount, {
      enabled: enabled,
      scheduleType: scheduleOption === "disabled" ? "daily" : scheduleOption,
      hour: hourNumber
    });
    
    if (success) {
      if (enabled && scheduleOption !== "disabled") {
        logScheduledSync(selectedAccount, scheduleOption, hourNumber);
        
        // Show success message with next sync time
        const nextSync = getNextSyncTime(scheduleOption, hourNumber);
        toast.success(`Automatic sync ${enabled ? 'enabled' : 'disabled'}. ${enabled ? `Next sync approximately ${nextSync}.` : ''}`);
      } else {
        toast.success(`Automatic sync ${enabled ? 'enabled' : 'disabled'}.`);
      }
      
      // Refresh the logs to show the new scheduled sync
      refreshLogs();
    } else {
      toast.error("Failed to update sync schedule");
    }
  };
  
  const handleOptionChange = (option: ScheduleOption) => {
    setScheduleOption(option);
    
    // Save the settings when option changes
    saveScheduleSettings();
  };
  
  const handleHourChange = (hour: string) => {
    setSpecificHour(hour);
    
    // Save the settings when hour changes
    saveScheduleSettings();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h4 className="font-medium">Enable automatic sync</h4>
          <p className="text-sm text-muted-foreground">
            Keep your newsletters up to date automatically
          </p>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={handleScheduleChange}
          disabled={!selectedAccount}
        />
      </div>
      
      {selectedAccount && isEnabled && (
        <>
          <ScheduleSelector
            selectedAccount={selectedAccount}
            scheduleOption={scheduleOption}
            specificHour={specificHour}
            onOptionChange={handleOptionChange}
            onHourChange={handleHourChange}
          />
          
          <ScheduleStatus
            scheduleOption={scheduleOption}
            specificHour={specificHour}
          />
        </>
      )}
    </div>
  );
}
