
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { DetailedSyncInfo, ScheduleDetails, StatusMessage, StatusBadge } from "../components";
import { SenderInfo } from "./SenderInfo";

// Component for the item number column
export function LogItemNum({ itemNumber }: { itemNumber: number }) {
  return <div className="flex items-center font-medium">{itemNumber}</div>;
}

// Component for the timestamp column
export function LogItemTime({ 
  timestamp, 
  formatTimestamp, 
  relativeTime 
}: { 
  timestamp: string; 
  formatTimestamp: (timestamp: string) => string;
  relativeTime: string;
}) {
  return (
    <div className="flex flex-col">
      <span>{formatTimestamp(timestamp)}</span>
      <span className="text-xs text-muted-foreground">{relativeTime}</span>
    </div>
  );
}

// Component for the status column
export function LogItemStatus({ 
  status,
  log
}: { 
  status: SyncLogEntry["status"];
  log: SyncLogEntry;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  
  return (
    <div>
      <div className="flex items-center gap-1">
        <StatusBadge status={status} />
        
        <Popover open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
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
      </div>
    </div>
  );
}

// Component for the sync type column
export function LogItemType({ syncType }: { syncType: string }) {
  return (
    <div className="flex items-center">
      <Badge variant={syncType === 'manual' ? 'outline' : 'secondary'} className="font-normal">
        {syncType === 'manual' ? 'Manual' : 'Scheduled'}
      </Badge>
    </div>
  );
}

// Component for the emails column
export function LogItemEmails({ 
  log, 
  totalEmails, 
  scheduleDetails 
}: { 
  log: SyncLogEntry; 
  totalEmails: number;
  scheduleDetails: boolean;
}) {
  return (
    <div className="flex items-center">
      {log.status !== 'scheduled' ? (
        <span>{totalEmails} email{totalEmails !== 1 ? 's' : ''}</span>
      ) : scheduleDetails && (
        <ScheduleDetails 
          scheduleType={log.details.schedule_type} 
          hour={log.details.hour} 
        />
      )}
    </div>
  );
}

// Component for the senders column
export function LogItemSenders({ 
  uniqueSendersCount,
  sendersList,
  syncedEmails
}: { 
  uniqueSendersCount: number;
  sendersList: string[];
  syncedEmails: any[];
}) {
  const [isSendersOpen, setIsSendersOpen] = React.useState(false);
  
  return (
    <div className="flex items-center">
      {uniqueSendersCount > 0 ? (
        <SenderInfo 
          uniqueSendersCount={uniqueSendersCount}
          sendersList={sendersList}
          syncedEmails={syncedEmails}
          isSendersOpen={isSendersOpen}
          setIsSendersOpen={setIsSendersOpen}
        />
      ) : (
        <span>0</span>
      )}
    </div>
  );
}

// Component for the details column
export function LogItemDetails({ log }: { log: SyncLogEntry }) {
  return (
    <div className="flex items-center">
      <StatusMessage log={log} />
    </div>
  );
}
