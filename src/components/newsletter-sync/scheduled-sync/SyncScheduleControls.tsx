
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { updateSyncSchedule, getSyncSchedule, getNextSyncTime } from "@/lib/supabase/emailAccounts/syncLogs";
import { ScheduleSelector, ScheduleStatus, AccountNotice } from "./components";

type ScheduleOption = "hourly" | "daily" | "disabled";

type SyncScheduleControlsProps = {
  selectedAccount: string | null;
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
  scheduleOption: ScheduleOption;
  setScheduleOption: (value: ScheduleOption) => void;
  specificHour: string;
  setSpecificHour: (value: string) => void;
  refreshLogs: () => void;
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
  const [nextSyncTime, setNextSyncTime] = useState<Date | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Load current sync schedule for the selected account
  useEffect(() => {
    if (!selectedAccount) return;
    
    const loadSyncSchedule = async () => {
      const schedule = await getSyncSchedule(selectedAccount);
      
      if (schedule) {
        setIsEnabled(schedule.enabled);
        setScheduleOption(schedule.scheduleType as ScheduleOption);
        
        if (schedule.hour !== undefined && schedule.hour !== null) {
          setSpecificHour(schedule.hour.toString().padStart(2, '0'));
        }
        
        if (schedule.lastUpdated) {
          setLastUpdated(schedule.lastUpdated);
        }
        
        // Calculate next sync time
        if (schedule.enabled) {
          const next = getNextSyncTime(schedule.scheduleType, schedule.hour);
          setNextSyncTime(next);
        } else {
          setNextSyncTime(null);
        }
      }
    };
    
    loadSyncSchedule();
  }, [selectedAccount, setIsEnabled, setScheduleOption, setSpecificHour]);
  
  // Update next sync time when schedule changes
  useEffect(() => {
    if (isEnabled) {
      const hour = parseInt(specificHour);
      const next = getNextSyncTime(scheduleOption, isNaN(hour) ? undefined : hour);
      setNextSyncTime(next);
    } else {
      setNextSyncTime(null);
    }
  }, [isEnabled, scheduleOption, specificHour]);

  const handleSaveSchedule = async () => {
    if (!selectedAccount) {
      toast.error("Please select an email account first");
      return;
    }

    setIsSaving(true);
    
    try {
      // Save schedule settings to the database using the updateSyncSchedule function
      const success = await updateSyncSchedule(
        selectedAccount,
        isEnabled,
        scheduleOption,
        scheduleOption === "daily" ? parseInt(specificHour) : undefined
      );

      if (!success) throw new Error("Failed to update sync schedule");
      
      // Update last updated timestamp
      setLastUpdated(new Date().toISOString());
      
      // Show success message
      if (isEnabled) {
        const scheduleDesc = scheduleOption === "hourly" ? "every hour" : `daily at ${specificHour}:00`;
        toast.success(`Automatic sync enabled for ${scheduleDesc}`);
      } else {
        toast.success("Automatic sync disabled");
      }
      
      // Refresh logs after saving
      refreshLogs();
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <ScheduleSelector
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        scheduleOption={scheduleOption}
        setScheduleOption={setScheduleOption}
        specificHour={specificHour}
        setSpecificHour={setSpecificHour}
        onSaveSchedule={handleSaveSchedule}
        isSaving={isSaving}
        disabled={!selectedAccount}
      />
      
      <ScheduleStatus
        isEnabled={isEnabled}
        nextSyncTime={nextSyncTime}
        lastUpdated={lastUpdated}
        selectedAccount={selectedAccount}
      />
      
      <AccountNotice selectedAccount={selectedAccount} />
    </div>
  );
}
