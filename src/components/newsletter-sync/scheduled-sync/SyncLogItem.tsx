
import React, { useState } from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { formatDistanceToNow } from "date-fns";
import { InfoIcon } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  StatusBadge, 
  DetailedSyncInfo, 
  ScheduleDetails, 
  StatusMessage 
} from "./components";

type SyncLogItemProps = {
  log: SyncLogEntry;
  formatTimestamp: (timestamp: string) => string;
  itemNumber: number;
};

export function SyncLogItem({ log, formatTimestamp, itemNumber }: SyncLogItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Format relative time
  const relativeTime = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });
  
  // Extract additional metrics from details if available
  const newSenders = log.details?.new_senders_count || 0;
  const totalEmails = log.message_count || 0;
  const syncType = log.sync_type || 'manual';
  
  // Schedule details if it's a scheduled log
  const scheduleDetails = log.status === 'scheduled' && log.details;
  
  return (
    <div className="px-4 py-3 text-xs border-b border-muted hover:bg-muted/20">
      <div className="grid grid-cols-[5%_25%_18%_17%_35%] gap-2 w-full items-center">
        <div className="font-medium">{itemNumber}</div>
        <div className="flex flex-col">
          <span>{formatTimestamp(log.timestamp)}</span>
          <span className="text-xs text-muted-foreground">{relativeTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <StatusBadge status={log.status} />
          
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 rounded-full p-0 ml-1"
                aria-label="View sync details"
              >
                <InfoIcon className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white text-gray-900 border border-gray-200 shadow-md p-4" align="end">
              <DetailedSyncInfo log={log} />
            </PopoverContent>
          </Popover>
          
          <div className="text-xs text-muted-foreground mt-1 ml-1">
            {syncType === 'manual' ? 'Manual sync' : 'Scheduled'}
          </div>
        </div>
        <div className="flex items-center">
          {log.status !== 'scheduled' ? (
            <span>
              {totalEmails} email{totalEmails !== 1 ? 's' : ''}
            </span>
          ) : scheduleDetails && (
            <ScheduleDetails 
              scheduleType={log.details.schedule_type} 
              hour={log.details.hour} 
            />
          )}
        </div>
        <div>
          <StatusMessage log={log} />
        </div>
      </div>
      
      {/* Additional metrics row */}
      {log.status === "success" && newSenders > 0 && (
        <div className="grid grid-cols-[5%_25%_18%_17%_35%] gap-2 mt-1 text-muted-foreground">
          <div></div>
          <div></div>
          <div></div>
          <div>{newSenders} new sender{newSenders !== 1 ? 's' : ''}</div>
          <div></div>
        </div>
      )}
    </div>
  );
}
