
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { formatDistanceToNow } from "date-fns";
import { 
  LogItemNum, 
  LogItemTime, 
  LogItemStatus, 
  LogItemType, 
  LogItemEmails, 
  LogItemSenders, 
  LogItemDetails 
} from './LogItemColumns';

type SyncLogItemProps = {
  log: SyncLogEntry;
  formatTimestamp: (timestamp: string) => string;
  itemNumber: number;
};

export function SyncLogItem({ log, formatTimestamp, itemNumber }: SyncLogItemProps) {
  // Format relative time
  const relativeTime = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true });
  
  // Extract additional metrics from details if available
  const totalEmails = log.message_count || 0;
  const syncType = log.sync_type || 'manual';
  
  // Schedule details if it's a scheduled log
  const scheduleDetails = log.status === 'scheduled' && log.details;
  
  // Get synced emails and unique senders
  const syncedEmails = log.details?.synced || [];
  
  // Process sender information
  const { uniqueSendersCount, sendersList } = processLogSenders(log, syncedEmails);
  
  // Ensure the account email is available for display
  if (log.details && !log.details.accountEmail && log.account?.email) {
    log.details.accountEmail = log.account.email;
  }
  
  return (
    <div className="px-4 py-3 text-xs border-b border-muted hover:bg-muted/20">
      <div className="grid grid-cols-[5%_20%_14%_10%_10%_10%_31%] w-full">
        <LogItemNum itemNumber={itemNumber} />
        <LogItemTime timestamp={log.timestamp} formatTimestamp={formatTimestamp} relativeTime={relativeTime} />
        <LogItemStatus status={log.status} log={log} />
        <LogItemType syncType={syncType} />
        <LogItemEmails log={log} totalEmails={totalEmails} scheduleDetails={scheduleDetails} />
        <LogItemSenders uniqueSendersCount={uniqueSendersCount} sendersList={sendersList} syncedEmails={syncedEmails} />
        <LogItemDetails log={log} />
      </div>
    </div>
  );
}

// Process sender information from log
function processLogSenders(log: SyncLogEntry, syncedEmails: any[]) {
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
    
  return { uniqueSendersCount, sendersList };
}
