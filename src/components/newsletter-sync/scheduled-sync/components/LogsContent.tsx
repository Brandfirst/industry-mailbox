
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { SyncLogItem } from "../SyncLogItem";

type LogsContentProps = {
  isLoading: boolean;
  syncLogs: SyncLogEntry[];
  selectedAccount: string | null;
  formatTimestamp: (timestamp: string) => string;
};

export function LogsContent({
  isLoading,
  syncLogs,
  selectedAccount,
  formatTimestamp
}: LogsContentProps) {
  if (isLoading) {
    return (
      <div className="px-4 py-4 text-xs text-center text-muted-foreground">
        Loading sync logs...
      </div>
    );
  }
  
  if (syncLogs.length > 0) {
    return (
      <>
        {syncLogs.map((log, index) => (
          <SyncLogItem 
            key={index} 
            log={log} 
            formatTimestamp={formatTimestamp} 
          />
        ))}
      </>
    );
  }
  
  return (
    <div className="px-4 py-4 text-xs text-center text-muted-foreground">
      {selectedAccount ? "No sync logs available" : "Select an account to view sync logs"}
    </div>
  );
}
