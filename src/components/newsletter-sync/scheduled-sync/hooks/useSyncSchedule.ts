
import { useEffect } from "react";
import { ScheduleOption } from "../SyncScheduleControls";
import { useScheduleState } from "./useScheduleState";
import { useDebugLogging } from "./useDebugLogging";
import { useRealtimeAccountUpdates } from "./useRealtimeAccountUpdates";
import { triggerManualMinuteSync } from "./useManualSync";
import { saveScheduleOperation } from "./useSaveSchedule";

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
  // Use the extracted state management hook
  const {
    isSaving,
    setIsSaving,
    hasSaved,
    setHasSaved,
    saveTimestamp,
    setSaveTimestamp,
    resetSavedStatus
  } = useScheduleState({ lastUpdated });
  
  // Reset saved status when settings change
  useEffect(() => {
    resetSavedStatus();
  }, [isEnabled, scheduleOption, specificHour]);
  
  // Use debug logging
  useDebugLogging({
    selectedAccount,
    isEnabled,
    scheduleOption,
    specificHour
  });
  
  // Set up realtime subscription for account settings
  useRealtimeAccountUpdates({
    selectedAccount,
    refreshLogs
  });

  // Function to handle manual sync triggering
  const handleManualMinuteSync = async () => {
    await triggerManualMinuteSync({
      selectedAccount,
      isEnabled,
      scheduleOption,
      refreshLogs
    });
  };

  // Function to save schedule
  const saveSchedule = async () => {
    await saveScheduleOperation({
      selectedAccount,
      isEnabled,
      scheduleOption,
      specificHour,
      setIsSaving,
      setSaveTimestamp,
      setHasSaved,
      refreshLogs,
      triggerManualMinuteSync: handleManualMinuteSync
    });
  };

  return {
    isSaving,
    hasSaved,
    saveTimestamp,
    triggerManualMinuteSync: handleManualMinuteSync,
    saveSchedule
  };
}
