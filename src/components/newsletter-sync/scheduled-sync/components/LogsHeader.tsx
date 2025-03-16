
import React from "react";
import { Button } from "@/components/ui/button";

type LogsHeaderProps = {
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
  selectedAccount: string | null;
  fetchSyncLogs: () => Promise<void>;
};

export function LogsHeader({
  showLogs,
  setShowLogs,
  selectedAccount,
  fetchSyncLogs
}: LogsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium">Sync History</h3>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => {
          setShowLogs(!showLogs);
          if (!showLogs && selectedAccount) {
            fetchSyncLogs();
          }
        }}
        className="text-xs"
      >
        {showLogs ? "Hide logs" : "Show logs"}
      </Button>
    </div>
  );
}
