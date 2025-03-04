
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
  
  // Extract additional metrics from details if available
  const newSenders = log.details?.new_senders_count || 0;
  const totalEmails = log.message_count || 0;
  
  return (
    <div className="px-4 py-2 text-xs">
      <div className="grid grid-cols-4 gap-2 mb-1">
        <div>{formatTimestamp(log.timestamp)}</div>
        <div>
          <span className={`inline-block px-2 py-1 rounded text-xs ${statusDisplay.className}`}>
            {statusDisplay.label}
          </span>
        </div>
        <div>
          {totalEmails} message{totalEmails !== 1 ? 's' : ''}
        </div>
        <div className="text-muted-foreground truncate">
          {log.error_message || "Completed successfully"}
        </div>
      </div>
      
      {/* Additional metrics row */}
      {log.status === "success" && (
        <div className="grid grid-cols-4 gap-2 mt-1 text-muted-foreground">
          <div></div>
          <div></div>
          <div>{newSenders > 0 && `${newSenders} new sender${newSenders !== 1 ? 's' : ''}`}</div>
          <div></div>
        </div>
      )}
    </div>
  );
}
