
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

type SyncLogItemProps = {
  log: SyncLogEntry;
  formatTimestamp: (timestamp: string) => string;
};

export function SyncLogItem({ log, formatTimestamp }: SyncLogItemProps) {
  // Get status display configuration
  const getStatusDisplay = (log: SyncLogEntry) => {
    switch(log.status) {
      case "success":
        return {
          label: "Success",
          className: "bg-green-100 text-green-800"
        };
      case "failed":
        return {
          label: "Failed",
          className: "bg-red-100 text-red-800"
        };
      case "scheduled":
        return {
          label: "Scheduled",
          className: "bg-blue-100 text-blue-800"
        };
      case "processing":
        return {
          label: "Processing",
          className: "bg-yellow-100 text-yellow-800"
        };
      default:
        return {
          label: log.status,
          className: "bg-gray-100 text-gray-800"
        };
    }
  };
  
  const statusDisplay = getStatusDisplay(log);
  
  // Format relative time
  const relativeTime = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });
  
  // Extract additional metrics from details if available
  const newSenders = log.details?.new_senders_count || 0;
  const totalEmails = log.message_count || 0;
  const syncType = log.sync_type || 'manual';
  
  // Schedule details if it's a scheduled log
  const scheduleDetails = log.status === 'scheduled' && log.details && (
    <div>
      {log.details.schedule_type === 'hourly' 
        ? 'Every hour' 
        : log.details.schedule_type === 'minute'
        ? 'Every minute'
        : `Daily at ${log.details.hour}:00`}
    </div>
  );
  
  return (
    <div className="px-4 py-2 text-xs">
      <div className="grid grid-cols-4 gap-2 mb-1">
        <div className="flex flex-col">
          <span>{formatTimestamp(log.timestamp)}</span>
          <span className="text-xs text-muted-foreground">{relativeTime}</span>
        </div>
        <div>
          <Badge className={`inline-block px-2 py-1 rounded text-xs ${statusDisplay.className}`}>
            {statusDisplay.label}
          </Badge>
          <div className="text-xs text-muted-foreground mt-1">
            {syncType === 'manual' ? 'Manual sync' : 'Scheduled'}
          </div>
        </div>
        <div>
          {log.status !== 'scheduled' ? (
            <>
              {totalEmails} message{totalEmails !== 1 ? 's' : ''}
            </>
          ) : scheduleDetails}
        </div>
        <div className="text-muted-foreground truncate">
          {log.error_message || (log.status === 'success' ? "Completed successfully" : 
                                log.status === 'scheduled' ? "Sync scheduled" : 
                                log.status === 'processing' ? "Sync in progress" : "")}
        </div>
      </div>
      
      {/* Additional metrics row */}
      {log.status === "success" && newSenders > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-1 text-muted-foreground">
          <div></div>
          <div></div>
          <div>{newSenders} new sender{newSenders !== 1 ? 's' : ''}</div>
          <div></div>
        </div>
      )}
    </div>
  );
}
