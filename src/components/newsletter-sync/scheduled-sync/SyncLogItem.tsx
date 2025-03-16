
import React, { useState } from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { formatDistanceToNow } from "date-fns";
import { InfoIcon, MailIcon, MessageCircleIcon, UsersIcon } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

type SyncLogItemProps = {
  log: SyncLogEntry;
  formatTimestamp: (timestamp: string) => string;
  itemNumber: number;
};

export function SyncLogItem({ log, formatTimestamp, itemNumber }: SyncLogItemProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSendersOpen, setIsSendersOpen] = useState(false);
  
  // Format relative time
  const relativeTime = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });
  
  // Extract additional metrics from details if available
  const totalEmails = log.message_count || 0;
  const syncType = log.sync_type || 'manual';
  
  // Schedule details if it's a scheduled log
  const scheduleDetails = log.status === 'scheduled' && log.details;
  
  // Get synced emails and unique senders
  const syncedEmails = log.details?.synced || [];
  const uniqueSenders = new Set<string>();
  
  syncedEmails.forEach((email: any) => {
    if (email.sender_email) {
      uniqueSenders.add(email.sender_email);
    }
  });
  
  // Ensure the account email is available for the DetailedSyncInfo component
  if (log.details && !log.details.accountEmail && log.account?.email) {
    log.details.accountEmail = log.account.email;
  }
  
  return (
    <div className="px-4 py-3 text-xs border-b border-muted hover:bg-muted/20">
      <div className="grid grid-cols-[5%_20%_14%_10%_10%_10%_31%] w-full">
        <div className="flex items-center font-medium">{itemNumber}</div>
        
        <div className="flex flex-col">
          <span>{formatTimestamp(log.timestamp)}</span>
          <span className="text-xs text-muted-foreground">{relativeTime}</span>
        </div>
        
        <div>
          <div className="flex items-center gap-1">
            <StatusBadge status={log.status} />
            
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
        
        {/* Type column */}
        <div className="flex items-center">
          <Badge variant={syncType === 'manual' ? 'outline' : 'secondary'} className="font-normal">
            {syncType === 'manual' ? 'Manual' : 'Scheduled'}
          </Badge>
        </div>
        
        {/* Emails column */}
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
        
        {/* Senders column - Just showing the total count */}
        <div className="flex items-center">
          {uniqueSenders.size > 0 ? (
            <div className="flex items-center gap-1">
              <span>{uniqueSenders.size}</span>
              
              <Popover open={isSendersOpen} onOpenChange={setIsSendersOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 rounded-full p-0"
                    aria-label="View sender details"
                  >
                    <UsersIcon className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 bg-white text-gray-900 border border-gray-200 shadow-md p-4" align="end">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Sender Information</h4>
                    <div className="text-xs">
                      <div className="font-medium mb-1">
                        {uniqueSenders.size} unique sender{uniqueSenders.size !== 1 ? 's' : ''}:
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {Array.from(uniqueSenders).map((sender, idx) => (
                          <div key={idx} className="truncate">{sender}</div>
                        ))}
                      </div>
                      
                      {syncedEmails.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="font-medium mb-1">Synced Emails:</div>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {syncedEmails.slice(0, 5).map((email: any, idx: number) => (
                              <div key={idx} className="pb-1 mb-1 border-b border-gray-100 last:border-0">
                                <div className="truncate"><span className="font-medium">From:</span> {email.sender || email.sender_email}</div>
                                <div className="truncate"><span className="font-medium">Subject:</span> {email.title || email.subject || 'No subject'}</div>
                              </div>
                            ))}
                            {syncedEmails.length > 5 && (
                              <div className="text-xs text-muted-foreground">
                                + {syncedEmails.length - 5} more email{syncedEmails.length - 5 !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <span>0</span>
          )}
        </div>
        
        {/* Details column */}
        <div className="flex items-center">
          <StatusMessage log={log} />
        </div>
      </div>
    </div>
  );
}
