
import React, { useState } from "react";
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSendersOpen, setIsSendersOpen] = useState(false);
  
  // Format relative time
  const relativeTime = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });
  
  // Extract additional metrics from details if available
  const totalEmails = log.message_count || 0;
  const syncType = log.sync_type || 'manual';
  
  // Make sure we handle the synced emails correctly
  const syncedEmails = log.details?.synced || [];
  
  // Process all sender information
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
  
  // Ensure the account email is available
  if (log.details && !log.details.accountEmail && log.account?.email) {
    log.details.accountEmail = log.account.email;
  }
  
  return (
    <div className="grid grid-cols-[5%_20%_14%_10%_10%_10%_31%] w-full items-center p-2 border-b border-gray-100 last:border-0">
      <div className="font-medium overflow-hidden text-ellipsis">{itemNumber}</div>
      
      <div className="flex flex-col overflow-hidden">
        <span className="truncate">{formatTimestamp(log.timestamp)}</span>
        <span className="text-xs text-muted-foreground truncate">{relativeTime}</span>
      </div>
      
      <div className="overflow-hidden">
        <StatusColumn 
          log={log} 
          isDetailsOpen={isDetailsOpen} 
          setIsDetailsOpen={setIsDetailsOpen} 
        />
      </div>
      
      <div className="overflow-hidden">
        <TypeColumn syncType={syncType} />
      </div>
      
      <div className="relative z-30 overflow-hidden">
        <EmailsColumn log={log} totalEmails={totalEmails} />
      </div>
      
      <div className="overflow-hidden">
        <SendersColumn 
          uniqueSendersCount={uniqueSendersCount}
          sendersList={sendersList}
          syncedEmails={syncedEmails}
          isSendersOpen={isSendersOpen}
          setIsSendersOpen={setIsSendersOpen}
        />
      </div>
      
      <div className="overflow-hidden truncate">
        <StatusMessage log={log} />
      </div>
    </div>
  );
}
