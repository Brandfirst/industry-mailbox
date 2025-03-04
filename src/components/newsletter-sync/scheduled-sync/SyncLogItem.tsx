
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";

type SyncLogItemProps = {
  log: SyncLogEntry;
  formatTimestamp: (timestamp: string) => string;
};

export function SyncLogItem({ log, formatTimestamp }: SyncLogItemProps) {
  // Determine display status and message count for nicer UI
  const getDisplayStatus = (log: SyncLogEntry) => {
    if (log.status === "success") {
      return {
        label: "Success",
        className: "bg-green-100 text-green-800"
      };
    } else {
      return {
        label: "Failed",
        className: "bg-red-100 text-red-800"
      };
    }
  };
  
  const statusDisplay = getDisplayStatus(log);
  
  return (
    <div className="px-4 py-2 text-xs grid grid-cols-4 gap-2">
      <div>{formatTimestamp(log.timestamp)}</div>
      <div>
        <span className={`inline-block px-2 py-1 rounded text-xs ${statusDisplay.className}`}>
          {statusDisplay.label}
        </span>
      </div>
      <div>{log.message_count}</div>
      <div className="text-muted-foreground truncate">
        {log.error_message || "Completed successfully"}
      </div>
    </div>
  );
}
