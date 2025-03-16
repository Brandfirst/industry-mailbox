
import { useState, useEffect } from "react";

/**
 * Manages the state for sync schedule controls
 */
export function useScheduleState({
  lastUpdated
}: {
  lastUpdated?: string;
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
  const resetSavedStatus = () => {
    if (hasSaved) {
      setHasSaved(false);
    }
  };

  return {
    isSaving,
    setIsSaving,
    hasSaved,
    setHasSaved,
    saveTimestamp,
    setSaveTimestamp,
    resetSavedStatus
  };
}
