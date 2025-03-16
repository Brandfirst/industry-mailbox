
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type TestSyncButtonProps = {
  enabled: boolean;
  scheduleOption: string;
  onTriggerManualSync: () => Promise<void>;
};

export function TestSyncButton({ enabled, scheduleOption, onTriggerManualSync }: TestSyncButtonProps) {
  const [isTesting, setIsTesting] = useState(false);
  
  if (!enabled || scheduleOption !== "minute") {
    return null;
  }
  
  const handleTestClick = async () => {
    setIsTesting(true);
    try {
      await onTriggerManualSync();
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <div className="mt-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleTestClick}
        className="w-full bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
        disabled={isTesting}
      >
        {isTesting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Testing...
          </>
        ) : (
          "Test Minute Sync Now"
        )}
      </Button>
      <div className="text-xs text-muted-foreground mt-1">
        This will manually trigger the scheduled sync now for testing
      </div>
    </div>
  );
}
