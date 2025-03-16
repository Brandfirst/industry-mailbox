
import { ScheduleSelector } from "./components/ScheduleSelector";
import { ScheduleStatus } from "./components/ScheduleStatus";
import { TestSyncButton } from "./components/TestSyncButton";
import { SavedIndicator } from "./components/SavedIndicator";
import { useSyncSchedule } from "./hooks/useSyncSchedule";

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
  // Use the sync schedule hook to handle business logic
  const {
    isSaving,
    hasSaved,
    saveTimestamp,
    triggerManualMinuteSync,
    saveSchedule
  } = useSyncSchedule({
    selectedAccount,
    isEnabled,
    setIsEnabled,
    scheduleOption,
    setScheduleOption,
    specificHour,
    lastUpdated,
    refreshLogs
  });

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
      
      <SavedIndicator hasSaved={hasSaved} />
      
      <TestSyncButton 
        enabled={isEnabled}
        scheduleOption={scheduleOption}
        onTriggerManualSync={triggerManualMinuteSync}
      />
    </div>
  );
}
