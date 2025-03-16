
import React from "react";
import { Button } from "@/components/ui/button";

type TestSyncButtonProps = {
  enabled: boolean;
  scheduleOption: string;
  onTriggerManualSync: () => Promise<void>;
};

export function TestSyncButton({ enabled, scheduleOption, onTriggerManualSync }: TestSyncButtonProps) {
  if (!enabled || scheduleOption !== "minute") {
    return null;
  }
  
  return (
    <div className="mt-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onTriggerManualSync}
        className="w-full bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100"
      >
        Test Minute Sync Now
      </Button>
      <div className="text-xs text-muted-foreground mt-1">
        This will manually trigger the scheduled sync now for testing
      </div>
    </div>
  );
}
