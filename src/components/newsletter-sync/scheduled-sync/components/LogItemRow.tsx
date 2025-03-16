
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { StatusColumn } from "./StatusColumn";
import { TypeColumn } from "./TypeColumn";
import { EmailsColumn } from "./EmailsColumn";
import { SendersColumn } from "./SendersColumn";
import { StatusMessage } from "./StatusMessage";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";

interface LogItemRowProps {
  log: SyncLogEntry;
  formatTimestamp: (timestamp: string) => string;
  itemNumber: number;
  totalItems: number;
}

export function LogItemRow({ log, formatTimestamp, itemNumber, totalItems }: LogItemRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isSendersOpen, setIsSendersOpen] = React.useState(false);
  
  // Format relative time
  const relativeTime = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });
  
  // Extract additional metrics from details if available
  const totalEmails = log.message_count || 0;
  const syncType = log.sync_type || 'manual';
  
  // Get synced emails and unique senders
  const syncedEmails = log.details?.synced || [];
  const uniqueSenders = new Set<string>();
  const sendersList: string[] = [];
  
  // Get full sender information
  syncedEmails.forEach((email: any) => {
    if (email.sender_email) {
      uniqueSenders.add(email.sender_email);
      if (!sendersList.includes(email.sender_email)) {
        sendersList.push(email.sender_email);
      }
    }
  });
  
  // If we don't have synced emails with sender info but have senders data in details
  if (sendersList.length === 0 && log.details?.senders) {
    // If senders is an array, add each one
    if (Array.isArray(log.details.senders)) {
      log.details.senders.forEach((sender: string) => {
        if (!sendersList.includes(sender)) {
          sendersList.push(sender);
        }
      });
    }
  }
  
  // Get unique senders count from details if available, otherwise use the calculated one
  const uniqueSendersCount = log.details?.new_senders_count !== undefined 
    ? log.details.new_senders_count 
    : uniqueSenders.size;
  
  // Ensure the account email is available for the DetailedSyncInfo component
  if (log.details && !log.details.accountEmail && log.account?.email) {
    log.details.accountEmail = log.account.email;
  }
  
  // Calculate the reversed item number (newest = #1)
  const reversedItemNumber = totalItems - itemNumber + 1;
  
  return (
    <div className="grid grid-cols-[5%_20%_14%_10%_10%_10%_31%] w-full">
      <div className="flex items-center font-medium">{reversedItemNumber}</div>
      
      <div className="flex flex-col">
        <span>{formatTimestamp(log.timestamp)}</span>
        <span className="text-xs text-muted-foreground">{relativeTime}</span>
      </div>
      
      <div>
        <StatusColumn 
          log={log} 
          isDetailsOpen={isDetailsOpen} 
          setIsDetailsOpen={setIsDetailsOpen} 
        />
      </div>
      
      {/* Type column */}
      <TypeColumn syncType={syncType} />
      
      {/* Emails column - Make sure this column has proper z-index to be clickable */}
      <div className="relative z-20 pointer-events-auto">
        <EmailsColumn log={log} totalEmails={totalEmails} />
      </div>
      
      {/* Senders column */}
      <SendersColumn 
        uniqueSendersCount={uniqueSendersCount}
        sendersList={sendersList}
        syncedEmails={syncedEmails}
        isSendersOpen={isSendersOpen}
        setIsSendersOpen={setIsSendersOpen}
      />
      
      {/* Details column */}
      <div className="flex items-center">
        <StatusMessage log={log} />
      </div>
    </div>
  );
}
