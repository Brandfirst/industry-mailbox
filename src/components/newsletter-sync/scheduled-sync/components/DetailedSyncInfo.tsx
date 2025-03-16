
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { 
  BasicSyncInfo,
  SyncedEmailsSection,
  UniqueSendersSection,
  ErrorMessage 
} from "./detail-sections";

interface DetailedSyncInfoProps {
  log: SyncLogEntry;
}

export function DetailedSyncInfo({ log }: DetailedSyncInfoProps) {
  // Extract account email from log details or account relationship
  const accountEmail = log.details?.accountEmail || log.account?.email || 'Not available';
                      
  const syncedCount = log.details?.syncedCount || 0;
  const failedCount = log.details?.failedCount || 0;
  const startTime = log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown';
  const syncType = log.sync_type || 'manual';
  const syncedEmails = log.details?.synced || [];
  const newSendersCount = log.details?.new_senders_count || 0;
  
  // Extract unique senders for display
  const uniqueSenders = new Set<string>();
  syncedEmails.forEach((email: any) => {
    if (email.sender_email) {
      uniqueSenders.add(email.sender_email);
    }
  });
  const uniqueSendersArray = Array.from(uniqueSenders);
  
  return (
    <div className="space-y-3 p-1 text-gray-900 bg-white">
      <h4 className="font-medium text-sm">Sync Details</h4>
      
      <BasicSyncInfo
        accountEmail={accountEmail}
        syncedCount={syncedCount}
        failedCount={failedCount}
        startTime={startTime}
        syncType={syncType}
        status={log.status}
      />
      
      <UniqueSendersSection
        uniqueSendersArray={uniqueSendersArray}
        newSendersCount={newSendersCount}
      />
      
      <SyncedEmailsSection
        syncedEmails={syncedEmails}
      />
      
      <ErrorMessage
        errorMessage={log.error_message}
      />
    </div>
  );
}
