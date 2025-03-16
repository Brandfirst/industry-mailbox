
import { useEffect } from "react";
import { ScheduleOption } from "../SyncScheduleControls";

/**
 * Provides debug logging for sync schedule settings
 */
export function useDebugLogging({
  selectedAccount,
  isEnabled,
  scheduleOption,
  specificHour
}: {
  selectedAccount: string | null;
  isEnabled: boolean;
  scheduleOption: ScheduleOption;
  specificHour: string;
}) {
  // Debug log for settings updates
  useEffect(() => {
    console.log("SyncScheduleControls updated:", {
      selectedAccount,
      isEnabled,
      scheduleOption,
      specificHour
    });
  }, [selectedAccount, isEnabled, scheduleOption, specificHour]);
}
