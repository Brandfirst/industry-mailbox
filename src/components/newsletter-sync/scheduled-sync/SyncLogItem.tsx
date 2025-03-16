
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertTriangle, Calendar } from "lucide-react";

type SyncLogItemProps = {
  log: SyncLogEntry;
  formatTimestamp: (timestamp: string) => string;
};

export function SyncLogItem({ log, formatTimestamp }: SyncLogItemProps) {
  // Get status display configuration
  const getStatusConfig = (log: SyncLogEntry) => {
    switch(log.status) {
      case "success":
        return {
          label: "Success",
          variant: "success" as const,
          icon: <CheckCircle className="h-3 w-3 mr-1" />
        };
      case "failed":
        return {
          label: "Failed",
          variant: "destructive" as const,
          icon: <AlertTriangle className="h-3 w-3 mr-1" />
        };
      case "scheduled":
        return {
          label: "Scheduled",
          variant: "info" as const,
          icon: <Calendar className="h-3 w-3 mr-1" />
        };
      default:
        return {
          label: log.status,
          variant: "secondary" as const,
          icon: null
        };
    }
  };
  
  const statusConfig = getStatusConfig(log);
  
  // Format relative time
  const relativeTime = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });
  
  // Extract additional metrics from details if available
  const newSenders = log.details?.new_senders_count || 0;
  const totalEmails = log.message_count || 0;
  const syncType = log.sync_type || 'manual';
  
  // Schedule details if it's a scheduled log
  const scheduleDetails = log.status === 'scheduled' && log.details && (
    <div className="flex items-center text-muted-foreground">
      <Clock className="h-3 w-3 mr-1" />
      {log.details.schedule_type === 'hourly' 
        ? 'Every hour' 
        : `Daily at ${log.details.hour}:00`}
    </div>
  );
  
  return (
    <div className="py-3 px-4 border-b last:border-b-0 hover:bg-muted/20 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Badge variant={statusConfig.variant} className="flex items-center">
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {syncType === 'manual' ? 'Manual sync' : 'Scheduled'}
            </span>
          </div>
          <div className="flex items-center mt-1 text-xs">
            <span className="font-medium">{formatTimestamp(log.timestamp)}</span>
            <span className="mx-1 text-muted-foreground">•</span>
            <span className="text-muted-foreground">{relativeTime}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:items-end">
          {log.status !== 'scheduled' ? (
            <>
              <div className="font-medium">
                {totalEmails} message{totalEmails !== 1 ? 's' : ''}
              </div>
              {newSenders > 0 && (
                <div className="text-xs text-muted-foreground">
                  {newSenders} new sender{newSenders !== 1 ? 's' : ''}
                </div>
              )}
            </>
          ) : scheduleDetails}
        </div>
      </div>
      
      {/* Error message for failed syncs */}
      {log.error_message && (
        <div className="mt-2 p-2 bg-destructive/10 text-destructive rounded text-xs">
          {log.error_message}
        </div>
      )}
    </div>
  );
}
