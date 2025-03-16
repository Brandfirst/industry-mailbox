
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs/types";
import { LogItemColumns } from "./LogItemColumns";
import { SenderInfo } from "./SenderInfo";
import { EmailDetails } from "./EmailDetails";

type SyncLogItemProps = {
  log: SyncLogEntry;
  formatTimestamp: (timestamp: string) => string;
};

export function SyncLogItem({ log, formatTimestamp }: SyncLogItemProps) {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusClass = () => {
    switch (log.status) {
      case "success": return "bg-green-100 text-green-800 border-green-200";
      case "failed": return "bg-red-100 text-red-800 border-red-200";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "partial": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "scheduled": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const renderLogStatus = () => {
    return (
      <Badge 
        variant="outline" 
        className={`px-2 py-1 font-medium capitalize ${getStatusClass()}`}
      >
        {log.status}
      </Badge>
    );
  };
  
  // Extract details from the log
  const details = log.details || {};
  
  // Extract synced emails from details
  const syncedEmails = Array.isArray(details.synced) ? details.synced : [];
  
  // Determine if we should show expanded view
  const hasEmailsToShow = syncedEmails.length > 0;
  const hasDetails = log.error_message || hasEmailsToShow;
  
  return (
    <div className="border rounded-md mb-3 overflow-hidden">
      <div className="p-3 bg-white">
        <LogItemColumns 
          status={renderLogStatus()}
          timestamp={formatTimestamp(log.timestamp)}
          syncType={log.sync_type || "manual"}
          messageCount={log.message_count}
        />
        
        {/* Sender info section */}
        <SenderInfo 
          accountEmail={log.account?.email || details.accountEmail}
          syncedCount={details.synced_count}
          failedCount={details.failed_count}
          newSendersCount={details.new_senders_count}
          scheduleType={details.schedule_type}
          hour={details.hour}
        />
        
        {/* Error message */}
        {log.error_message && (
          <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
            {log.error_message}
          </div>
        )}
        
        {/* Expand/collapse button */}
        {hasEmailsToShow && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-xs h-6"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>Hide Details <ChevronUpIcon className="ml-1 h-3 w-3" /></>
            ) : (
              <>Show Details <ChevronDownIcon className="ml-1 h-3 w-3" /></>
            )}
          </Button>
        )}
        
        {/* Synced emails details */}
        {expanded && hasEmailsToShow && (
          <EmailDetails syncedEmails={syncedEmails} />
        )}
      </div>
    </div>
  );
}
