
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
      case "partial":
        return {
          label: "Partial",
          className: "bg-orange-100 text-orange-800"
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
  
  // Generate appropriate message based on status
  const getMessage = () => {
    if (log.error_message) return log.error_message;
    
    switch(log.status) {
      case 'success':
        return "Completed successfully";
      case 'scheduled':
        return "Sync scheduled";
      case 'processing':
        return "Sync in progress";
      case 'partial':
        return "Some emails failed to sync";
      case 'failed':
        if (!log.error_message) return "Sync failed";
        return log.error_message;
      default:
        return "";
    }
  };
  
  return (
    <div className="px-4 py-3 text-xs border-b border-muted hover:bg-gray-50">
      <div className="grid grid-cols-[25%_20%_20%_35%] gap-2">
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
          {getMessage()}
        </div>
      </div>
      
      {/* Additional metrics row */}
      {log.status === "success" && newSenders > 0 && (
        <div className="grid grid-cols-[25%_20%_20%_35%] gap-2 mt-1 text-muted-foreground">
          <div></div>
          <div></div>
          <div>{newSenders} new sender{newSenders !== 1 ? 's' : ''}</div>
          <div></div>
        </div>
      )}
    </div>
  );
}
