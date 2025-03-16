
import React, { useState } from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type SyncLogItemProps = {
  log: SyncLogEntry;
  formatTimestamp: (timestamp: string) => string;
};

export function SyncLogItem({ log, formatTimestamp }: SyncLogItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get status display configuration
  const getStatusDisplay = (log: SyncLogEntry) => {
    switch(log.status?.toLowerCase()) {
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
          label: log.status || "Unknown",
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
    
    switch(log.status?.toLowerCase()) {
      case 'success':
        return totalEmails > 0 
          ? "Completed successfully" 
          : "Completed successfully (no new emails)";
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
        return log.status || "";
    }
  };
  
  // Get content for details popup
  const getDetailsContent = () => {
    const accountEmail = log.details?.accountEmail || 'Unknown';
    const provider = log.details?.provider || 'Unknown';
    const syncedCount = log.details?.syncedCount || 0;
    const failedCount = log.details?.failedCount || 0;
    const startTime = log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown';
    
    return (
      <div className="space-y-3 p-1">
        <h4 className="font-medium text-sm">Sync Details</h4>
        
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground">Account:</div>
            <div>{accountEmail}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground">Provider:</div>
            <div className="capitalize">{provider}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground">Started:</div>
            <div>{startTime}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
            <div className="text-muted-foreground">Type:</div>
            <div className="capitalize">{syncType}</div>
          </div>
          
          {log.status !== 'scheduled' && (
            <>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-muted-foreground">Status:</div>
                <div>{statusDisplay.label}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <div className="text-muted-foreground">Synced:</div>
                <div>{syncedCount} emails</div>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                <div className="text-muted-foreground">Failed:</div>
                <div>{failedCount} emails</div>
              </div>
              
              {newSenders > 0 && (
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">New senders:</div>
                  <div>{newSenders}</div>
                </div>
              )}
            </>
          )}
          
          {log.error_message && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="text-muted-foreground mb-1">Error:</div>
              <div className="text-red-600 break-words">{log.error_message}</div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="px-4 py-3 text-xs border-b border-muted hover:bg-muted/20">
      <div className="grid grid-cols-[25%_20%_20%_35%] gap-2 w-full items-center">
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
        <div className="flex items-center">
          {log.status !== 'scheduled' ? (
            <span>
              {totalEmails} email{totalEmails !== 1 ? 's' : ''}
            </span>
          ) : scheduleDetails}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground truncate mr-2">
            {getMessage()}
          </span>
          
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full"
                aria-label="View sync details"
              >
                <InfoIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              {getDetailsContent()}
            </PopoverContent>
          </Popover>
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
